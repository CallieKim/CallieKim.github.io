/* global React */
const { useState, useRef, useEffect } = React;

// Atomic block vocabulary — echoes end-user robot programming research
const BLOCK_LIBRARY = [
  { id: "home",    label: "go home",    verb: "home",    dur: 900 },
  { id: "reach",   label: "reach →",    verb: "reach",   dur: 1100 },
  { id: "grip",    label: "grip",       verb: "grip",    dur: 700 },
  { id: "lift",    label: "lift ↑",     verb: "lift",    dur: 900 },
  { id: "rotate",  label: "rotate 90°", verb: "rotate",  dur: 1000 },
  { id: "place",   label: "place",      verb: "place",   dur: 900 },
  { id: "release", label: "release",    verb: "release", dur: 600 },
];

const DEFAULT_PROGRAM = ["home", "reach", "grip", "lift", "rotate", "place", "release"];

// Arm pose: base angle (deg), elbow (deg), gripper (0 open -> 1 closed), payload attached
function poseFor(verb, t) {
  // t is 0..1 within the step
  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
  const e = ease(t);
  switch (verb) {
    case "home":    return { base: lerp(20, 0, e),    elbow: lerp(40, 60, e),  grip: 0, payload: false, note: "returning to home" };
    case "reach":   return { base: lerp(0, -35, e),   elbow: lerp(60, 30, e),  grip: 0, payload: false, note: "reaching toward object" };
    case "grip":    return { base: -35,               elbow: 30,                grip: e,  payload: false, note: "closing gripper" };
    case "lift":    return { base: -35,               elbow: lerp(30, 70, e),   grip: 1, payload: true,  note: "lifting payload" };
    case "rotate":  return { base: lerp(-35, 40, e),  elbow: 70,                grip: 1, payload: true,  note: "rotating base" };
    case "place":   return { base: 40,                elbow: lerp(70, 35, e),   grip: 1, payload: true,  note: "placing at target" };
    case "release": return { base: 40,                elbow: 35,                grip: 1 - e, payload: e < 0.5, note: "releasing grip" };
    default:        return { base: 0, elbow: 60, grip: 0, payload: false, note: "idle" };
  }
}
function lerp(a, b, t) { return a + (b - a) * t; }

function RobotScene({ pose }) {
  // SVG arm — minimal, technical
  const baseX = 140, baseY = 170;
  const upperLen = 58, foreLen = 52;
  const baseRad = (pose.base * Math.PI) / 180;
  // Shoulder joint at base. Elbow angle bends fore-arm.
  const shoulderAngle = baseRad - Math.PI / 2; // point up-ish
  const elbowRad = shoulderAngle + ((90 - pose.elbow) * Math.PI) / 180;
  const elbowX = baseX + Math.cos(shoulderAngle) * upperLen;
  const elbowY = baseY + Math.sin(shoulderAngle) * upperLen;
  const tipX = elbowX + Math.cos(elbowRad) * foreLen;
  const tipY = elbowY + Math.sin(elbowRad) * foreLen;
  const gripOpen = 1 - pose.grip;

  return (
    <svg viewBox="0 0 280 220" className="robot-svg" aria-hidden="true">
      {/* grid floor */}
      <defs>
        <pattern id="gridp" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M 14 0 L 0 0 0 14" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.25"/>
        </pattern>
      </defs>
      <rect x="10" y="150" width="260" height="60" fill="url(#gridp)" />
      <line x1="10" y1="172" x2="270" y2="172" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />

      {/* target zone */}
      <rect x="200" y="162" width="34" height="14" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      <text x="217" y="190" textAnchor="middle" className="robot-label">target</text>

      {/* source object (hidden when payload attached) */}
      {!pose.payload && (
        <g>
          <rect x="58" y="160" width="14" height="12" fill="currentColor" opacity="0.85" />
          <text x="65" y="186" textAnchor="middle" className="robot-label">obj</text>
        </g>
      )}

      {/* base */}
      <rect x={baseX - 18} y={baseY} width="36" height="14" fill="currentColor" opacity="0.9" />
      <rect x={baseX - 24} y={baseY + 14} width="48" height="4" fill="currentColor" opacity="0.6" />

      {/* upper arm */}
      <line x1={baseX} y1={baseY} x2={elbowX} y2={elbowY} stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {/* fore arm */}
      <line x1={elbowX} y1={elbowY} x2={tipX} y2={tipY} stroke="currentColor" strokeWidth="5" strokeLinecap="round" />

      {/* joints */}
      <circle cx={baseX} cy={baseY} r="4" fill="var(--paper)" stroke="currentColor" strokeWidth="1.5" />
      <circle cx={elbowX} cy={elbowY} r="3.5" fill="var(--paper)" stroke="currentColor" strokeWidth="1.5" />

      {/* gripper */}
      <g transform={`translate(${tipX} ${tipY}) rotate(${(elbowRad * 180) / Math.PI + 90})`}>
        <line x1={-5 - gripOpen * 4} y1="0" x2={-5 - gripOpen * 4} y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1={5 + gripOpen * 4}  y1="0" x2={5 + gripOpen * 4}  y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {pose.payload && (
          <rect x="-7" y="7" width="14" height="12" fill="currentColor" opacity="0.85" />
        )}
      </g>

      {/* tip coordinate readout */}
      <text x="12" y="22" className="robot-label">pose</text>
      <text x="12" y="34" className="robot-mono">
        θ₁={pose.base.toFixed(0).padStart(3, " ")}° θ₂={pose.elbow.toFixed(0).padStart(2, " ")}° g={pose.grip.toFixed(2)}
      </text>
    </svg>
  );
}

function RobotDemo() {
  const [program, setProgram] = useState(DEFAULT_PROGRAM);
  const [playing, setPlaying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [stepT, setStepT] = useState(0);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const rafRef = useRef(null);
  const lastRef = useRef(null);

  const activeVerb = program[stepIdx] ? BLOCK_LIBRARY.find(b => b.id === program[stepIdx]).verb : "home";
  const activeDur  = program[stepIdx] ? BLOCK_LIBRARY.find(b => b.id === program[stepIdx]).dur : 800;
  const pose = poseFor(activeVerb, stepT);

  useEffect(() => {
    if (!playing) return;
    lastRef.current = performance.now();
    const tick = (now) => {
      const dt = now - lastRef.current;
      lastRef.current = now;
      setStepT((prev) => {
        const next = prev + dt / activeDur;
        if (next >= 1) {
          setStepIdx((i) => {
            if (i + 1 >= program.length) { setPlaying(false); return i; }
            return i + 1;
          });
          return 0;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, activeDur, program.length]);

  const play = () => {
    if (stepIdx >= program.length - 1 && stepT >= 1) {
      setStepIdx(0); setStepT(0);
    }
    setPlaying(true);
  };
  const reset = () => { setPlaying(false); setStepIdx(0); setStepT(0); };
  const clear = () => { reset(); setProgram([]); };

  // drag from library -> program
  const onLibDragStart = (e, id) => { setDragging({ from: "lib", id }); e.dataTransfer.effectAllowed = "copy"; };
  // drag within program to reorder
  const onProgDragStart = (e, idx) => { setDragging({ from: "prog", idx }); e.dataTransfer.effectAllowed = "move"; };
  const onSlotDragOver = (e, idx) => { e.preventDefault(); setDragOver(idx); };
  const onSlotDrop = (e, idx) => {
    e.preventDefault();
    if (!dragging) return;
    if (dragging.from === "lib") {
      const p = [...program];
      p.splice(idx, 0, dragging.id);
      setProgram(p);
    } else if (dragging.from === "prog") {
      const p = [...program];
      const [moved] = p.splice(dragging.idx, 1);
      const insertAt = idx > dragging.idx ? idx - 1 : idx;
      p.splice(insertAt, 0, moved);
      setProgram(p);
    }
    setDragging(null); setDragOver(null);
    reset();
  };
  const onEndDrop = (e) => {
    e.preventDefault();
    if (!dragging) return;
    if (dragging.from === "lib") setProgram([...program, dragging.id]);
    setDragging(null); setDragOver(null);
    reset();
  };
  const removeBlock = (idx) => {
    const p = [...program]; p.splice(idx, 1); setProgram(p); reset();
  };

  return (
    <div className="demo">
      <div className="demo-head">
        <span className="mono-label">fig.01 · block-based end-user robot programmer</span>
        <span className="mono-label demo-status">
          {playing ? "▶ running" : (stepT >= 1 && stepIdx >= program.length - 1 ? "● complete" : "◻ idle")}
          {"  "}· step {Math.min(stepIdx + 1, program.length || 1)}/{program.length || 1}
        </span>
      </div>

      <div className="demo-stage">
        <RobotScene pose={pose} />
        <div className="demo-caption">
          <span className="mono-label">//</span> <span className="demo-note">{pose.note}</span>
        </div>
      </div>

      <div className="demo-program" onDragOver={(e) => e.preventDefault()} onDrop={onEndDrop}>
        <span className="mono-label prog-gutter">program</span>
        <div className="prog-track">
          {program.length === 0 && (
            <div className="prog-empty">drag blocks here →</div>
          )}
          {program.map((id, idx) => {
            const b = BLOCK_LIBRARY.find(x => x.id === id);
            const isActive = playing && idx === stepIdx;
            const isDone = idx < stepIdx || (idx === stepIdx && stepT >= 1 && !playing);
            return (
              <React.Fragment key={idx}>
                <div
                  className={`prog-slot ${dragOver === idx ? "over" : ""}`}
                  onDragOver={(e) => onSlotDragOver(e, idx)}
                  onDrop={(e) => onSlotDrop(e, idx)}
                />
                <div
                  className={`blk blk-in-prog ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
                  draggable
                  onDragStart={(e) => onProgDragStart(e, idx)}
                  title="drag to reorder; click × to remove"
                >
                  <span className="blk-num">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="blk-label">{b.label}</span>
                  <button className="blk-x" onClick={() => removeBlock(idx)} aria-label="remove">×</button>
                </div>
              </React.Fragment>
            );
          })}
          <div
            className={`prog-slot prog-slot-end ${dragOver === program.length ? "over" : ""}`}
            onDragOver={(e) => onSlotDragOver(e, program.length)}
            onDrop={(e) => onSlotDrop(e, program.length)}
          />
        </div>
      </div>

      <div className="demo-lib">
        <span className="mono-label">blocks</span>
        <div className="lib-row">
          {BLOCK_LIBRARY.map(b => (
            <div
              key={b.id}
              className="blk blk-in-lib"
              draggable
              onDragStart={(e) => onLibDragStart(e, b.id)}
              onClick={() => { setProgram([...program, b.id]); reset(); }}
              title="drag into program, or click to append"
            >
              <span className="blk-label">{b.label}</span>
              <span className="blk-plus">+</span>
            </div>
          ))}
        </div>
      </div>

      <div className="demo-controls">
        <button className="ctrl ctrl-primary" onClick={playing ? () => setPlaying(false) : play} disabled={program.length === 0}>
          {playing ? "pause" : (stepT >= 1 && stepIdx >= program.length - 1 ? "replay" : "run")}
        </button>
        <button className="ctrl" onClick={reset} disabled={program.length === 0}>reset</button>
        <button className="ctrl" onClick={clear} disabled={program.length === 0}>clear</button>
        <span className="mono-label demo-hint">tip: try <em>reach → grip → lift → rotate → place → release</em></span>
      </div>
    </div>
  );
}

window.RobotDemo = RobotDemo;
