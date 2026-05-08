/* global React */
const PUBS = [
  {
    id: "robocritics",
    title: "RoboCritics: Enabling Reliable End-to-End LLM Robot Programming through Expert-Informed Critics",
    venue: "HRI",
    venueFull: "Proc. of the 21st ACM/IEEE Int'l Conference on Human-Robot Interaction",
    year: 2026,
    tags: ["HRI", "LLMs", "End-User Programming"],
    role: "first author",
    blurb: "A critic architecture that catches unsafe or under-specified LLM-generated robot programs before execution.",
  },
  {
    id: "bridging",
    title: "Bridging Generations using AI-Supported Co-Creative Activities",
    venue: "CHI",
    venueFull: "Proc. of the 2025 CHI Conference on Human Factors in Computing Systems",
    year: 2025,
    tags: ["HRI", "LLMs", "Co-Creation"],
    role: "first author",
    blurb: "Co-creative story workshops with grandparents and grandchildren mediated by LLM-supported tools.",
  },
  {
    id: "coframear",
    title: "CoFrameAR: Collaborative Robot Programming through Spatially-Anchored AR Annotations",
    venue: "UIST",
    venueFull: "Proc. of the ACM Symposium on User Interface Software and Technology",
    year: 2024,
    tags: ["AR/VR", "HRI", "End-User Programming"],
    role: "first author",
    blurb: "Users annotate intent in AR; the robot verifies interpretation before acting.",
  },
  {
    id: "roboblocks",
    title: "RoboBlocks: Scaffolded Block-Based Interfaces for Novice Robot Programmers",
    venue: "IDC",
    venueFull: "Proc. of the Interaction Design and Children Conference",
    year: 2023,
    tags: ["End-User Programming", "HRI"],
    role: "co-author",
    blurb: "Block vocabulary and scaffolding patterns that help novices express multi-step robot tasks.",
  },
];

function PubList({ variant, accent }) {
  if (variant === "cards") return <PubCards />;
  if (variant === "timeline") return <PubTimeline />;
  return <PubStandard />;
}

function PubStandard() {
  return (
    <ol className="pub-list">
      {PUBS.map((p, i) => (
        <li key={p.id} className="pub-item">
          <div className="pub-meta">
            <span className="pub-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="pub-venue">{p.venue} ’{String(p.year).slice(2)}</span>
          </div>
          <div className="pub-body">
            <h4 className="pub-title"><a href="#">{p.title}</a></h4>
            <p className="pub-blurb">{p.blurb}</p>
            <div className="pub-tags">
              {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
              <span className="pub-role">· {p.role}</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function PubCards() {
  return (
    <div className="pub-cards">
      {PUBS.map(p => (
        <a href="#" key={p.id} className="pub-card">
          <div className="pub-card-fig" aria-hidden="true">
            <div className="pub-card-placeholder">
              <span className="mono-label">fig · {p.id}</span>
              <svg viewBox="0 0 100 60" preserveAspectRatio="none">
                <defs>
                  <pattern id={`s-${p.id}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                    <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="100" height="60" fill={`url(#s-${p.id})`} />
              </svg>
            </div>
          </div>
          <div className="pub-card-body">
            <span className="mono-label">{p.venue} ’{String(p.year).slice(2)}</span>
            <h4 className="pub-card-title">{p.title}</h4>
            <p className="pub-card-blurb">{p.blurb}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

function PubTimeline() {
  const byYear = {};
  PUBS.forEach(p => { (byYear[p.year] = byYear[p.year] || []).push(p); });
  const years = Object.keys(byYear).sort((a, b) => b - a);
  return (
    <div className="pub-timeline">
      {years.map(y => (
        <div key={y} className="pub-year">
          <div className="pub-year-mark">
            <span className="pub-year-n">{y}</span>
          </div>
          <div className="pub-year-items">
            {byYear[y].map(p => (
              <a href="#" key={p.id} className="pub-tl-item">
                <span className="mono-label pub-tl-venue">{p.venue}</span>
                <span className="pub-tl-title">{p.title}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

window.PubList = PubList;
