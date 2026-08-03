// Lively 1.1.0 (@people_and_robots/lively) — bundler-target build, so we
// instantiate the WASM manually and hand it to the JS glue module.
import * as bg from "/assets/robot/lively/lively_bg.js";

(async function () {
  try {
    var wasmResp = await fetch("/assets/robot/lively/lively_bg.wasm");
    var wasmBytes = await wasmResp.arrayBuffer();
    var wasmModule = await WebAssembly.instantiate(wasmBytes, {
      "./lively_bg.js": bg,
    });
    bg.__wbg_set_wasm(wasmModule.instance.exports);

    var urdfResp = await fetch("/assets/robot/ur3/ur3e.urdf");
    var urdfStr = await urdfResp.text();

    // Keyed objectives (v1 API). Weights here are defaults; every solve()
    // call passes its own weights table with the same keys.
    var objectives = {
      position: { type: "PositionMatch", name: "EE Pos", link: "tool0", weight: 50 },
      smoothness: { type: "SmoothnessMacro", name: "Smooth", weight: 20 },
      collision: { type: "CollisionAvoidance", name: "Collision", weight: 10 },
      // Keeps the gripper facing down in both interactive and score mode
      orientation: { type: "OrientationMatch", name: "EE Rot", link: "tool0", weight: 25 },
    };

    var rootBounds = [
      { value: 0, delta: 0 },
      { value: 0, delta: 0 },
      { value: 0, delta: 0 },
      { value: 0, delta: 0 },
      { value: 0, delta: 0 },
      { value: 0, delta: 0 },
    ];

    // No environment shapes: a ground plane here used to block the gripper
    // from lowering all the way to the cube (its collision box got pushed up
    // before the pads reached grasp depth). Waypoints and the interactive
    // target's 0.15 height floor keep the arm above ground anyway.
    // Collision avoidance now only handles robot self-collision.
    var shapes = [];

    // Precomputed IK solution for hovering above the cube (scene
    // [0.2, 0.15, 0.15], gripper facing down) — both modes start here
    var initialJoints = {
      shoulder_pan_joint: -2.7071,
      shoulder_lift_joint: -1.9369,
      elbow_joint: 2.0829,
      wrist_1_joint: -1.7207,
      wrist_2_joint: -1.5688,
      wrist_3_joint: -1.1363,
    };

    var solver = new bg.Solver(
      urdfStr,
      objectives,
      rootBounds,
      shapes,
      {
        origin: { translation: [0, 0, 0], rotation: [0, 0, 0, 1] },
        joints: initialJoints,
      },
      1,
      25,
      undefined,
    );

    console.log("[IK] Solver initialized");

    // Normalize collision distances (samples 1000 random states, stores
    // average-distance table inside the solver's collision manager) so
    // permanently-close link pairs don't produce constant penalties
    var t0 = performance.now();
    var table = solver.computeAverageDistanceTable();
    console.log(
      "[IK] Distance table:",
      table && table.length,
      "pairs in",
      Math.round(performance.now() - t0),
      "ms",
    );

    var testResult = solver.solve(
      { position: { Translation: [0.2, 0, 0.3] } },
      { position: 50, smoothness: 20, collision: 10, orientation: 25 },
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
