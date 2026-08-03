(function () {
  "use strict";

  var container =
    document.getElementById("robot-sidebar-canvas") ||
    document.getElementById("robot-hero-canvas");
  if (!container) return;

  // ========== CONSTANTS ==========
  var PI = Math.PI;
  var HALF_PI = PI / 2;
  var MODE_INTERACTIVE = 0;
  var MODE_SCORE = 1;

  // ========== SCENE ==========
  var scene = new THREE.Scene();
  var width = container.clientWidth;
  var height = container.clientHeight;

  var camera = new THREE.PerspectiveCamera(35, width / height, 0.01, 10);
  camera.position.set(3.6, 0.65, 2.1);
  camera.lookAt(0, 0.45, 0);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  // ========== LIGHTING ==========
  var ambientLight = new THREE.HemisphereLight(0xb0c4de, 0x1a2332, 0.7);
  scene.add(ambientLight);

  var dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLight.position.set(3, 4, 3);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 10;
  scene.add(dirLight);

  var fillLight = new THREE.DirectionalLight(0x00bfa5, 0.15);
  fillLight.position.set(-2, 2, -1);
  scene.add(fillLight);

  // ========== GROUND PLANE ==========
  var groundGeo = new THREE.CircleGeometry(0.5, 32);
  var groundMat = new THREE.MeshStandardMaterial({
    color: 0x1a2332,
    roughness: 0.9,
    metalness: 0.1,
  });
  var ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -HALF_PI;
  ground.receiveShadow = true;
  scene.add(ground);

  // ========== HELPER ==========
  function makeFrame(pos, rpy) {
    var group = new THREE.Group();
    if (pos) group.position.set(pos[0], pos[1], pos[2]);
    if (rpy) {
      var q = new THREE.Quaternion();
      var euler = new THREE.Euler(rpy[0], rpy[1], rpy[2], "ZYX");
      q.setFromEuler(euler);
      group.quaternion.copy(q);
    }
    return group;
  }

  function loadMesh(loader, path, parent) {
    loader.load(path, function (gltf) {
      var model = gltf.scene;
      model.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      parent.add(model);
    });
  }

  // ========== UR3e KINEMATIC CHAIN ==========
  var robotRoot = new THREE.Group();
  robotRoot.rotation.x = -HALF_PI;
  robotRoot.rotation.z = -PI * 1.5;
  scene.add(robotRoot);

  var baseLink = new THREE.Group();
  robotRoot.add(baseLink);
  var baseVisual = makeFrame(null, [0, 0, PI]);
  baseLink.add(baseVisual);

  var shoulderPanFrame = makeFrame([0, 0, 0.1519], null);
  baseLink.add(shoulderPanFrame);
  var shoulderPanJoint = new THREE.Group();
  shoulderPanFrame.add(shoulderPanJoint);
  var shoulderVisual = makeFrame(null, [0, 0, PI]);
  shoulderPanJoint.add(shoulderVisual);

  var shoulderLiftFrame = makeFrame([0, 0, 0], [HALF_PI, 0, 0]);
  shoulderPanJoint.add(shoulderLiftFrame);
  var shoulderLiftJoint = new THREE.Group();
  shoulderLiftFrame.add(shoulderLiftJoint);
  var upperArmVisual = makeFrame([0, 0, 0.12], [HALF_PI, 0, -HALF_PI]);
  shoulderLiftJoint.add(upperArmVisual);

  var elbowFrame = makeFrame([-0.24365, 0, 0], null);
  shoulderLiftJoint.add(elbowFrame);
  var elbowJoint = new THREE.Group();
  elbowFrame.add(elbowJoint);
  var forearmVisual = makeFrame([0, 0, 0.027], [HALF_PI, 0, -HALF_PI]);
  elbowJoint.add(forearmVisual);

  var wrist1Frame = makeFrame([-0.21325, 0, 0.11235], null);
  elbowJoint.add(wrist1Frame);
  var wrist1Joint = new THREE.Group();
  wrist1Frame.add(wrist1Joint);
  var wrist1Visual = makeFrame([0, 0, -0.104], [HALF_PI, 0, 0]);
  wrist1Joint.add(wrist1Visual);

  var wrist2Frame = makeFrame([0, -0.08535, 0], [HALF_PI, 0, 0]);
  wrist1Joint.add(wrist2Frame);
  var wrist2Joint = new THREE.Group();
  wrist2Frame.add(wrist2Joint);
  var wrist2Visual = makeFrame([0, 0, -0.08535], null);
  wrist2Joint.add(wrist2Visual);

  var wrist3Frame = makeFrame([0, 0.0819, 0], [HALF_PI, PI, PI]);
  wrist2Joint.add(wrist3Frame);
  var wrist3Joint = new THREE.Group();
  wrist3Frame.add(wrist3Joint);
  var wrist3Visual = makeFrame([0, 0, -0.081], [HALF_PI, 0, 0]);
  wrist3Joint.add(wrist3Visual);

  // Grip point at end of wrist3 (for score mode cube tracking)
  var gripPoint = new THREE.Group();
  gripPoint.position.set(0, 0.09, 0);
  wrist3Joint.add(gripPoint);

  // ========== LOAD MESHES ==========
  var loader = new THREE.GLTFLoader();

  // UR3e
  var urPath = "/assets/robot/ur3/visual/";
  [
    ["base.glb", baseVisual],
    ["shoulder.glb", shoulderVisual],
    ["upperarm.glb", upperArmVisual],
    ["forearm.glb", forearmVisual],
    ["wrist1.glb", wrist1Visual],
    ["wrist2.glb", wrist2Visual],
    ["wrist3.glb", wrist3Visual],
  ].forEach(function (entry) {
    loadMesh(loader, urPath + entry[0], entry[1]);
  });


  // ========== SCORE MODE OBJECTS ==========
  var cubeSize = 0.025;
  var cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  var cubeMat = new THREE.MeshStandardMaterial({
    color: 0xff8c42,
    roughness: 0.3,
    metalness: 0.1,
  });
  var cube = new THREE.Mesh(cubeGeo, cubeMat);
  cube.castShadow = true;
  cube.visible = false;
  scene.add(cube);

  var cubeStartPos = new THREE.Vector3(0.2, cubeSize / 2, 0.15);

  // Open-top box
  var boxGroup = new THREE.Group();
  boxGroup.visible = false;
  scene.add(boxGroup);

  var boxW = 0.07;
  var boxH = 0.04;
  var boxD = 0.07;
  var boxWall = 0.003;
  var boxMat = new THREE.MeshStandardMaterial({
    color: 0x607080,
    roughness: 0.5,
    metalness: 0.3,
  });

  // Box bottom
  var boxBottom = new THREE.Mesh(
    new THREE.BoxGeometry(boxW, boxWall, boxD),
    boxMat,
  );
  boxBottom.position.y = boxWall / 2;
  boxBottom.castShadow = true;
  boxBottom.receiveShadow = true;
  boxGroup.add(boxBottom);

  // Box walls
  var wallGeo;

  wallGeo = new THREE.BoxGeometry(boxW, boxH, boxWall);
  var boxFront = new THREE.Mesh(wallGeo, boxMat);
  boxFront.position.set(0, boxH / 2, boxD / 2);
  boxFront.castShadow = true;
  boxGroup.add(boxFront);

  var boxBack = new THREE.Mesh(wallGeo, boxMat);
  boxBack.position.set(0, boxH / 2, -boxD / 2);
  boxBack.castShadow = true;
  boxGroup.add(boxBack);

  wallGeo = new THREE.BoxGeometry(boxWall, boxH, boxD);
  var boxLeft = new THREE.Mesh(wallGeo, boxMat);
  boxLeft.position.set(-boxW / 2, boxH / 2, 0);
  boxLeft.castShadow = true;
  boxGroup.add(boxLeft);

  var boxRight = new THREE.Mesh(wallGeo, boxMat);
  boxRight.position.set(boxW / 2, boxH / 2, 0);
  boxRight.castShadow = true;
  boxGroup.add(boxRight);

  var boxPos = new THREE.Vector3(-0.15, 0, 0.18);
  boxGroup.position.copy(boxPos);

  // ========== UI: MODE TOGGLE ==========
  var currentMode = MODE_INTERACTIVE;
  var score = 0;

  var modeBtn = document.createElement("button");
  modeBtn.className = "robot-mode-btn";
  modeBtn.innerHTML = "&#9654; Score Mode";
  container.appendChild(modeBtn);

  var scoreEl = document.createElement("div");
  scoreEl.className = "robot-score";
  scoreEl.textContent = "0";
  scoreEl.style.display = "none";
  container.appendChild(scoreEl);

  modeBtn.addEventListener("click", function () {
    if (currentMode === MODE_INTERACTIVE) {
      currentMode = MODE_SCORE;
      modeBtn.innerHTML = "&#9881; Interactive";
      scoreEl.style.display = "flex";
      cube.visible = true;
      boxGroup.visible = true;
      cube.position.copy(cubeStartPos);
      cubeState = "waiting";
      scoreAnimTime = 0;
      score = 0;
      scoreEl.textContent = "0";
      cubeFallVel = 0;
    } else {
      currentMode = MODE_INTERACTIVE;
      modeBtn.innerHTML = "&#9654; Score Mode";
      scoreEl.style.display = "none";
      cube.visible = false;
      boxGroup.visible = false;
      // Reset IK solver to current joint state for smooth transition
      if (window.__ikReady && window.__ikSolver) {
        try {
          window.__ikSolver.reset(
            {
              origin: { translation: [0, 0, 0], rotation: [1, 0, 0, 0] },
              joints: {
                shoulder_pan_joint: shoulderPanJoint.rotation.z,
                shoulder_lift_joint: shoulderLiftJoint.rotation.z,
                elbow_joint: elbowJoint.rotation.z,
                wrist_1_joint: wrist1Joint.rotation.z,
                wrist_2_joint: wrist2Joint.rotation.z,
                wrist_3_joint: wrist3Joint.rotation.z,
              },
            },
            [50, 20],
          );
        } catch (e) {
          console.warn("[IK] Reset failed:", e);
        }
      }
    }
  });

  function showPlusOne() {
    var el = document.createElement("div");
    el.className = "robot-plus-one";
    el.textContent = "+1";
    container.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 900);
  }

  // ========== INTERACTIVE MODE STATE ==========
  var targetMouseY = 0.5;
  var currentMouseY = 0.5;
  var targetMouseX = 0.5;
  var currentMouseX = 0.5;
  var smoothing = 3.0;

  // IK state — solver is created by ik-loader.js (ES module) and exposed as globals
  var smoothedTarget = new THREE.Vector3();
  var ikSceneTarget = new THREE.Vector3();
  var invRobotMatrix = new THREE.Matrix4();
  var invRobotMatrixCached = false;
  var ikInitializedInLoop = false;

  document.addEventListener("mousemove", function (e) {
    targetMouseY = e.clientY / window.innerHeight;
  });

  container.addEventListener("mousemove", function (e) {
    var rect = container.getBoundingClientRect();
    targetMouseX = (e.clientX - rect.left) / rect.width;
  });

  // ========== SCORE MODE ANIMATION ==========
  var scoreAnimTime = 0;
  var cubeState = "waiting";
  var cubeFallVel = 0;
  var lastScoredCycle = -1;

  // Keyframes: [shoulderPan, shoulderLift, elbow, wrist1, wrist2, wrist3, gripperAngle]
  var scoreKeyframes = [
    { t: 0.0, j: [0, -0.8, 1.0, -0.3, 0, 0], g: 0 },
    { t: 1.8, j: [0.5, -0.2, 0.5, -0.35, 0, 0.2], g: 0 },
    { t: 2.5, j: [0.5, -0.05, 0.35, -0.3, 0, 0.2], g: 0 },
    { t: 3.0, j: [0.5, -0.05, 0.35, -0.3, 0, 0.2], g: 0.6 },
    { t: 3.8, j: [0.5, -0.4, 0.7, -0.35, 0, 0.2], g: 0.6 },
    { t: 5.2, j: [-0.4, -0.35, 0.65, -0.35, 0, -0.2], g: 0.6 },
    { t: 5.8, j: [-0.4, -0.35, 0.65, -0.35, 0, -0.2], g: 0 },
    { t: 7.0, j: [0, -0.8, 1.0, -0.3, 0, 0], g: 0 },
    { t: 8.5, j: [0, -0.8, 1.0, -0.3, 0, 0], g: 0 },
  ];
  var cycleDuration = 8.5;

  // IK waypoints: scene-space positions the end-effector should reach
  // Same cycle timing as FK keyframes, but driven by IK solver
  var scoreIKWaypoints = [
    { t: 0.0, pos: [0.0, 0.25, 0.0], g: 0 },     // home / rest
    { t: 1.5, pos: [0.2, 0.15, 0.15], g: 0 },     // above cube
    { t: 2.5, pos: [0.2, 0.035, 0.15], g: 0 },    // lower to cube
    { t: 3.0, pos: [0.2, 0.035, 0.15], g: 0.6 },  // grip closed
    { t: 3.5, pos: [0.2, 0.15, 0.15], g: 0.6 },   // lift up
    { t: 5.0, pos: [-0.15, 0.15, 0.18], g: 0.6 }, // above box
    { t: 5.5, pos: [-0.15, 0.05, 0.18], g: 0.6 }, // lower to box
    { t: 5.8, pos: [-0.15, 0.05, 0.18], g: 0 },   // release
    { t: 6.5, pos: [-0.15, 0.15, 0.18], g: 0 },   // retract
    { t: 7.5, pos: [0.0, 0.25, 0.0], g: 0 },      // return home
    { t: 8.5, pos: [0.0, 0.25, 0.0], g: 0 },      // dwell
  ];

  function smoothstep(t) {
    t = Math.max(0, Math.min(1, t));
    return t * t * (3 - 2 * t);
  }

  function getAnimState(time) {
    var t = time % cycleDuration;
    var kf0 = scoreKeyframes[0];
    var kf1 = scoreKeyframes[0];

    for (var i = 0; i < scoreKeyframes.length - 1; i++) {
      if (t >= scoreKeyframes[i].t && t < scoreKeyframes[i + 1].t) {
        kf0 = scoreKeyframes[i];
        kf1 = scoreKeyframes[i + 1];
        break;
      }
    }
    if (t >= scoreKeyframes[scoreKeyframes.length - 1].t) {
      kf0 = scoreKeyframes[scoreKeyframes.length - 1];
      kf1 = kf0;
    }

    var seg = kf1.t - kf0.t;
    var alpha = seg > 0 ? smoothstep((t - kf0.t) / seg) : 1;

    var joints = [];
    for (var j = 0; j < 6; j++) {
      joints.push(kf0.j[j] + (kf1.j[j] - kf0.j[j]) * alpha);
    }
    var grip = kf0.g + (kf1.g - kf0.g) * alpha;

    return { joints: joints, grip: grip, cycleT: t };
  }

  function getScoreIKState(time) {
    var ct = time % cycleDuration;
    var wp0 = scoreIKWaypoints[0];
    var wp1 = scoreIKWaypoints[0];

    for (var i = 0; i < scoreIKWaypoints.length - 1; i++) {
      if (ct >= scoreIKWaypoints[i].t && ct < scoreIKWaypoints[i + 1].t) {
        wp0 = scoreIKWaypoints[i];
        wp1 = scoreIKWaypoints[i + 1];
        break;
      }
    }
    if (ct >= scoreIKWaypoints[scoreIKWaypoints.length - 1].t) {
      wp0 = scoreIKWaypoints[scoreIKWaypoints.length - 1];
      wp1 = wp0;
    }

    var seg = wp1.t - wp0.t;
    var alpha = seg > 0 ? smoothstep((ct - wp0.t) / seg) : 1;

    var pos = [
      wp0.pos[0] + (wp1.pos[0] - wp0.pos[0]) * alpha,
      wp0.pos[1] + (wp1.pos[1] - wp0.pos[1]) * alpha,
      wp0.pos[2] + (wp1.pos[2] - wp0.pos[2]) * alpha,
    ];
    var grip = wp0.g + (wp1.g - wp0.g) * alpha;

    return { pos: pos, grip: grip, cycleT: ct };
  }

  // ========== CAMERA ==========
  var camPos = new THREE.Vector3(3.0, 0.6, 2.5);
  var camLook = new THREE.Vector3(0, 0.25, 0);
  var targetCamPos = new THREE.Vector3();
  var targetCamLook = new THREE.Vector3();

  var interactiveCamPos = new THREE.Vector3(2.4, 0.65, 2.1);
  var interactiveCamLook = new THREE.Vector3(0, 0.25, 0);
  // Score camera: slightly wider to see cube + box, low to hide box interior
  var scoreCamPos = new THREE.Vector3(2.0, 0.4, 2.0);
  var scoreCamLook = new THREE.Vector3(0, 0.1, 0.1);

  // ========== ANIMATION LOOP ==========
  var clock = new THREE.Clock();
  var wpVec = new THREE.Vector3();
  var scoreIKTarget = new THREE.Vector3();

  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.05);
    var t = clock.getElapsedTime();
    var lerpFactor = Math.min(1, 2.5 * dt);

    // --- Camera target ---
    if (currentMode === MODE_INTERACTIVE) {
      targetCamPos.copy(interactiveCamPos);
      targetCamLook.copy(interactiveCamLook);
    } else {
      targetCamPos.copy(scoreCamPos);
      targetCamLook.copy(scoreCamLook);
    }
    camPos.lerp(targetCamPos, lerpFactor);
    camLook.lerp(targetCamLook, lerpFactor);

    if (currentMode === MODE_INTERACTIVE) {
      // Smooth mouse
      currentMouseY +=
        (targetMouseY - currentMouseY) * Math.min(1, smoothing * dt);
      currentMouseX +=
        (targetMouseX - currentMouseX) * Math.min(1, smoothing * dt);

      if (window.__ikReady && window.__ikSolver) {
        // On first IK frame, seed the smoothed target
        if (!ikInitializedInLoop) {
          ikInitializedInLoop = true;
          var state = window.__ikSolver.currentState;
          if (state && state.frames && state.frames.tool0) {
            var f = state.frames.tool0.translation;
            smoothedTarget.set(f[0], f[1], f[2]);
          }
        }

        // --- Interactive: IK cursor-following ---
        // Compute target in scene space — mouse controls height & lateral sweep
        // Camera views from +X/+Z quadrant; screen-up ~ scene Y, screen-right ~ scene -Z
        ikSceneTarget.set(
          -0.08,
          0.15 + (1.0 - currentMouseY) * 0.4,
          -0.05 + (currentMouseX - 0.5) * 0.3,
        );

        // Convert to URDF base frame (robotRoot never moves, so cache inverse)
        if (!invRobotMatrixCached) {
          scene.updateMatrixWorld(true);
          invRobotMatrix.copy(robotRoot.matrixWorld).invert();
          invRobotMatrixCached = true;
        }
        ikSceneTarget.applyMatrix4(invRobotMatrix);

        // Smooth the URDF-frame target
        smoothedTarget.lerp(ikSceneTarget, Math.min(1, 5 * dt));

        // Solve IK
        var result = window.__ikSolver.solve(
          [
            {
              Translation: [
                smoothedTarget.x,
                smoothedTarget.y,
                smoothedTarget.z,
              ],
            },
            null,
            null,
          ],
          [50, 20, 10],
          t,
          [],
        );

        // Apply joint angles from solver
        if (result && result.joints) {
          var j = result.joints;
          var sp = j.shoulder_pan_joint;
          var sl = j.shoulder_lift_joint;
          var el = j.elbow_joint;
          var w1 = j.wrist_1_joint;
          var w2 = j.wrist_2_joint;
          var w3 = j.wrist_3_joint;
          shoulderPanJoint.rotation.z = sp != null ? sp : 0;
          shoulderLiftJoint.rotation.z = sl != null ? sl : 0;
          elbowJoint.rotation.z = el != null ? el : 0;
          wrist1Joint.rotation.z = w1 != null ? w1 : 0;
          wrist2Joint.rotation.z = w2 != null ? w2 : 0;
          wrist3Joint.rotation.z = w3 != null ? w3 : 0;
        }
      } else {
        // --- FK fallback (before WASM loads) ---
        var reach = (currentMouseY - 0.5) * 2;
        var sway = Math.sin(t * 0.5) * 0.05;

        shoulderPanJoint.rotation.z = Math.sin(t * 0.3) * 0.15;
        shoulderLiftJoint.rotation.z = -0.8 + reach * 0.8 + sway;
        elbowJoint.rotation.z = 1.0 - reach * 0.5 + sway * 0.5;
        wrist1Joint.rotation.z = -0.3 + reach * 0.3;
        wrist2Joint.rotation.z = Math.sin(t * 0.4) * 0.2;
        wrist3Joint.rotation.z = Math.sin(t * 0.6) * 0.15;
      }
    } else {
      // --- Score mode: animated pick-and-place ---
      scoreAnimTime += dt;
      var ct = scoreAnimTime % cycleDuration;

      if (window.__ikReady && window.__ikSolver) {
        // IK-driven score mode
        var ikState = getScoreIKState(scoreAnimTime);

        // Ensure invRobotMatrix is cached
        if (!invRobotMatrixCached) {
          scene.updateMatrixWorld(true);
          invRobotMatrix.copy(robotRoot.matrixWorld).invert();
          invRobotMatrixCached = true;
        }

        // Convert scene-space target to URDF frame
        scoreIKTarget.set(ikState.pos[0], ikState.pos[1], ikState.pos[2]);
        scoreIKTarget.applyMatrix4(invRobotMatrix);

        // Solve IK
        var result = window.__ikSolver.solve(
          [
            {
              Translation: [
                scoreIKTarget.x,
                scoreIKTarget.y,
                scoreIKTarget.z,
              ],
            },
            null,
            null,
          ],
          [50, 20, 10],
          t,
          [],
        );

        // Apply joint angles from solver
        if (result && result.joints) {
          var j = result.joints;
          shoulderPanJoint.rotation.z = j.shoulder_pan_joint != null ? j.shoulder_pan_joint : 0;
          shoulderLiftJoint.rotation.z = j.shoulder_lift_joint != null ? j.shoulder_lift_joint : 0;
          elbowJoint.rotation.z = j.elbow_joint != null ? j.elbow_joint : 0;
          wrist1Joint.rotation.z = j.wrist_1_joint != null ? j.wrist_1_joint : 0;
          wrist2Joint.rotation.z = j.wrist_2_joint != null ? j.wrist_2_joint : 0;
          wrist3Joint.rotation.z = j.wrist_3_joint != null ? j.wrist_3_joint : 0;
        }
      } else {
        // FK fallback (before WASM loads)
        var fkState = getAnimState(scoreAnimTime);

        shoulderPanJoint.rotation.z = fkState.joints[0];
        shoulderLiftJoint.rotation.z = fkState.joints[1];
        elbowJoint.rotation.z = fkState.joints[2];
        wrist1Joint.rotation.z = fkState.joints[3];
        wrist2Joint.rotation.z = fkState.joints[4];
        wrist3Joint.rotation.z = fkState.joints[5];
      }

      // Update world matrices for grip point tracking
      scene.updateMatrixWorld(true);

      // Cube state machine
      var currentCycle = Math.floor(scoreAnimTime / cycleDuration);

      if (ct < 3.0) {
        // Cube on ground, waiting
        cubeState = "waiting";
        cube.position.copy(cubeStartPos);
        cube.visible = true;
        cubeFallVel = 0;
      } else if (ct >= 3.0 && ct < 5.8) {
        // Cube gripped — follow end effector
        cubeState = "gripped";
        gripPoint.getWorldPosition(wpVec);
        cube.position.copy(wpVec);
        cube.visible = true;
      } else if (ct >= 5.8 && ct < 6.5) {
        // Cube falling
        if (cubeState !== "falling") {
          cubeState = "falling";
          gripPoint.getWorldPosition(wpVec);
          cube.position.copy(wpVec);
          cubeFallVel = 0;
        }
        cubeFallVel += 1.2 * dt;
        cube.position.y -= cubeFallVel;

        // Stop at box floor
        var boxFloor = boxPos.y + boxWall + cubeSize / 2;
        if (cube.position.y <= boxFloor) {
          cube.position.y = boxFloor;
          cube.position.x = boxPos.x;
          cube.position.z = boxPos.z;

          if (currentCycle !== lastScoredCycle) {
            lastScoredCycle = currentCycle;
            score++;
            scoreEl.textContent = String(score);
            showPlusOne();
          }
          cubeState = "inbox";
        }
      } else if (ct >= 6.5 && ct < 8.0) {
        // Cube resting in box (hidden to reset)
        cube.visible = false;
        cubeState = "hidden";
      } else {
        // Brief pause before next cycle — show cube at start
        cubeState = "waiting";
        cube.position.copy(cubeStartPos);
        cube.visible = true;
        cubeFallVel = 0;
      }
    }

    camera.position.copy(camPos);
    camera.lookAt(camLook);
    renderer.render(scene, camera);
  }

  animate();

  // ========== RESIZE ==========
  window.addEventListener("resize", function () {
    var w = container.clientWidth;
    var h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
