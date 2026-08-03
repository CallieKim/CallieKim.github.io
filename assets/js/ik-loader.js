import init, { Solver } from "/assets/robot/lively/lively_tk_lib.js";

(async function () {
  try {
    await init("/assets/robot/lively/lively_tk_lib_bg.wasm");

    var urdfResp = await fetch("/assets/robot/ur3/ur3e.urdf");
    var urdfStr = await urdfResp.text();

    var objectives = [
      { type: "PositionMatch", name: "EE Pos", link: "tool0", weight: 50 },
      { type: "SmoothnessMacro", name: "Smooth", weight: 20 },
      { type: "CollisionAvoidance", name: "Collision", weight: 10 },
      // Orientation goal for tool0 — weight 0 in interactive mode (free),
      // raised in score mode to keep the gripper facing down
      { type: "OrientationMatch", name: "EE Rot", link: "tool0", weight: 0 },
    ];

    var rootBounds = [
      { value: 0, delta: 0 },
      { value: 0, delta: 0 },
      { value: 0, delta: 0 },
      { value: 0, delta: 0 },
      { value: 0, delta: 0 },
      { value: 0, delta: 0 },
    ];

    // Ground plane for collision avoidance (thin box at z=0 in URDF frame)
    var shapes = [
      {
        type: "Box",
        name: "ground",
        frame: "world",
        physical: true,
        x: 1.0,
        y: 1.0,
        z: 0.01,
        localTransform: {
          translation: [0, 0, -0.005],
          rotation: [1, 0, 0, 0],
        },
      },
    ];

    var initialJoints = {
      shoulder_pan_joint: 0,
      shoulder_lift_joint: -0.8,
      elbow_joint: 1.0,
      wrist_1_joint: -0.3,
      wrist_2_joint: 0,
      wrist_3_joint: 0,
    };

    var solver = new Solver(
      urdfStr,
      objectives,
      rootBounds,
      shapes,
      {
        origin: { translation: [0, 0, 0], rotation: [1, 0, 0, 0] },
        joints: initialJoints,
      },
      true,
      1,
      25,
    );

    console.log("[IK] Solver initialized");
    console.log("[IK] Objectives:", solver.objectives);
    console.log("[IK] Current goals:", solver.currentGoals);
    console.log("[IK] Joints:", solver.joints);
    console.log("[IK] Links:", solver.links);

    var testResult = solver.solve(
      [{ Translation: [0.2, 0, 0.3] }, null, null, null],
      [50, 20, 10, 0],
      0,
      [],
    );
    console.log("[IK] Test solve:", testResult);

    window.__ikSolver = solver;
    window.__ikReady = true;
    console.log("[IK] Ready");
  } catch (e) {
    console.warn("[IK] Init failed, using FK fallback:", e);
  }
})();
