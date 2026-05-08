/* global React */
const PUBS = [
  {
    id: "roboblocks",
    title:
      "Robo-Blocks: Generative Scaffolding in End-User Design and Programming of Social Robots",
    venue: "DIS",
    venueFull:
      "Proc. of the 2026 ACM Designing Interactive Systems Conference (DIS '26)",
    year: 2026,
    tags: ["HRI", "Generative Scaffolding", "End-User Programming"],
    role: "co-first author",
    blurb:
      "Block-based social-robot programming environment whose LLM-generated narrative scaffolding helps novices translate high-level ideas into executable behaviors.",
    url: "https://doi.org/10.1145/3800645.3812997",
  },
  {
    id: "AwDStechnologyProbe",
    title:
      "Supporting Money Management among Adults with Down Syndrome: A Multi-Technology Probe Study",
    venue: "HCI",
    venueFull:
      "Proc. of the 2026 CHI Conference on Human Factors in Computing Systems (CHI '26)",
    year: 2026,
    tags: ["HCI", "Accessibility", "Technology Probe"],
    role: "third author",
    blurb:
      "Multi-modality probe study mapping how gamified, AR, and tangible budgeting tools shape engagement, verification, and error recovery for adults with Down syndrome.",
    url: "https://dl.acm.org/doi/full/10.1145/3772318.3791299",
  },
  {
    id: "robocritics",
    title:
      "RoboCritics: Enabling Reliable End-to-End LLM Robot Programming through Expert-Informed Critics",
    venue: "HRI",
    venueFull:
      "Proc. of the 21st ACM/IEEE Int'l Conference on Human-Robot Interaction (HRI '26)",
    year: 2026,
    tags: ["HRI", "LLMs", "End-User Programming"],
    role: "first author",
    blurb:
      "A critic architecture that catches unsafe or under-specified LLM-generated robot programs before execution.",
    url: "https://wisc-hci.github.io/RoboCritics/",
  },
  {
    id: "morphology",
    title:
      "Elements of Robot Morphology: Supporting Designers in Robot Form Exploration",
    venue: "HRI",
    venueFull:
      "Proc. of the 21st ACM/IEEE Int'l Conference on Human-Robot Interaction (HRI '26)",
    year: 2026,
    tags: ["HRI", "Robot Morphology", "Design Tool"],
    role: "fourth author",
    blurb:
      "A tangible toolkit designed to facilitate hands-on form exploration.",
    url: "https://dl.acm.org/doi/abs/10.1145/3757279.3788653",
  },
  {
    id: "bridging",
    title: "Bridging Generations using AI-Supported Co-Creative Activities",
    venue: "CHI",
    venueFull:
      "Proc. of the 2025 CHI Conference on Human Factors in Computing Systems (CHI '25)",
    year: 2025,
    tags: ["HCI", "LLMs", "Co-Creation"],
    role: "first author",
    blurb:
      "Co-creative story workshops with grandparents and grandchildren mediated by LLM-supported tools.",
    url: "https://dl.acm.org/doi/10.1145/3706598.3713718",
  },
  {
    id: "llm-hri",
    title:
      "Understanding Large-Language Model (LLM)-powered Human-Robot Interaction",
    venue: "HRI",
    venueFull:
      "Proc. of the 2024 ACM/IEEE Int'l Conference on Human-Robot Interaction (HRI '24)",
    year: 2024,
    tags: ["HRI", "LLMs"],
    role: "co-first author",
    blurb:
      "User study (n=32) comparing an LLM-powered social robot against text- and voice-based agents on conversational tasks.",
    url: "https://dl.acm.org/doi/abs/10.1145/3610977.3634966",
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
            <span className="pub-venue">
              {p.venue} ’{String(p.year).slice(2)}
            </span>
          </div>
          <div className="pub-body">
            <h4 className="pub-title">
              {p.url ? (
                <a href={p.url} target="_blank" rel="noreferrer">
                  {p.title}
                </a>
              ) : (
                p.title
              )}
            </h4>
            <p className="pub-blurb">{p.blurb}</p>
            <div className="pub-tags">
              {p.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
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
      {PUBS.map((p) => (
        <a
          href={p.url || "#"}
          target={p.url ? "_blank" : undefined}
          rel={p.url ? "noreferrer" : undefined}
          key={p.id}
          className="pub-card"
        >
          <div className="pub-card-fig" aria-hidden="true">
            <div className="pub-card-placeholder">
              <span className="mono-label">fig · {p.id}</span>
              <svg viewBox="0 0 100 60" preserveAspectRatio="none">
                <defs>
                  <pattern
                    id={`s-${p.id}`}
                    width="6"
                    height="6"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(30)"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="6"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="60" fill={`url(#s-${p.id})`} />
              </svg>
            </div>
          </div>
          <div className="pub-card-body">
            <span className="mono-label">
              {p.venue} ’{String(p.year).slice(2)}
            </span>
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
  PUBS.forEach((p) => {
    (byYear[p.year] = byYear[p.year] || []).push(p);
  });
  const years = Object.keys(byYear).sort((a, b) => b - a);
  return (
    <div className="pub-timeline">
      {years.map((y) => (
        <div key={y} className="pub-year">
          <div className="pub-year-mark">
            <span className="pub-year-n">{y}</span>
          </div>
          <div className="pub-year-items">
            {byYear[y].map((p) => (
              <a
                href={p.url || "#"}
                target={p.url ? "_blank" : undefined}
                rel={p.url ? "noreferrer" : undefined}
                key={p.id}
                className="pub-tl-item"
              >
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
