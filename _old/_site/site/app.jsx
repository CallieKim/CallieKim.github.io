/* global React, ReactDOM, RobotDemo, PubList */
const { useState, useEffect } = React;

function App() {
  return (
    <div className="page">
      <Header />
      <main className="layout">
        <LeftRail />
        <article className="content">
          <Hero />
          <ResearchStatement />
          <DemoSection />
          <PublicationsSection />
          <BeyondSection />
          <Footer />
        </article>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="mark">
          <span className="mark-dot" />
          <span className="mark-name">Callie Y. Kim</span>
          <span className="mono-label mark-sub">/ research portfolio</span>
        </div>
        <nav className="nav">
          <a href="#about" className="nav-item"><span className="nav-num">01</span> About</a>
          <a href="#demo" className="nav-item"><span className="nav-num">02</span> Demo</a>
          <a href="#publications" className="nav-item"><span className="nav-num">03</span> Publications</a>
          <a href="#projects" className="nav-item"><span className="nav-num">04</span> Projects</a>
          <a href="#cv" className="nav-item"><span className="nav-num">05</span> CV</a>
        </nav>
      </div>
    </header>
  );
}

function LeftRail() {
  return (
    <aside className="rail">
      <div className="rail-avatar" aria-hidden="true">
        <div className="avatar-ph">
          <span className="mono-label">photo</span>
        </div>
      </div>
      <div className="rail-id">
        <div className="mono-label">researcher</div>
        <div className="rail-name">Callie Yejin Kim</div>
        <div className="rail-role">PhD Candidate · Computer Science</div>
      </div>
      <dl className="rail-facts">
        <div className="fact"><dt>loc</dt><dd>Madison, WI</dd></div>
        <div className="fact"><dt>lab</dt><dd>People & Robots Lab</dd></div>
        <div className="fact"><dt>advisor</dt><dd>Bilge Mutlu</dd></div>
        <div className="fact"><dt>year</dt><dd>5 / expected 2027</dd></div>
      </dl>
      <div className="rail-links">
        <div className="mono-label">contact</div>
        <a href="mailto:cykim6@wisc.edu" className="rail-link">cykim6@wisc.edu<span className="arr">↗</span></a>
        <a href="#" className="rail-link">Google Scholar<span className="arr">↗</span></a>
        <a href="https://github.com/CallieKim" className="rail-link">GitHub<span className="arr">↗</span></a>
        <a href="#" className="rail-link">ORCID<span className="arr">↗</span></a>
        <a href="#" className="rail-link">LinkedIn<span className="arr">↗</span></a>
        <a href="#" className="rail-link rail-link-primary">CV (pdf)<span className="arr">↓</span></a>
      </div>
      <div className="rail-status">
        <span className="status-dot" />
        <span className="mono-label">on the market · 2026–27</span>
      </div>
    </aside>
  );
}

function Hero() {
  return (
    <section id="about" className="hero">
      <div className="hero-meta">
        <span className="mono-label">§ 00 · about</span>
        <span className="mono-label">last updated · apr 2026</span>
      </div>
      <h1 className="hero-title">
        I study how people <em>communicate intent</em> to robots — and how robots can ask better questions back.
      </h1>
      <p className="hero-lede">
        Fifth-year PhD candidate in the <a href="#">People and Robots Laboratory</a> at the University of Wisconsin–Madison,
        advised by <a href="#">Bilge Mutlu</a>. Previously BS at Ewha Womans University (2019) and MS at the University of Maryland (2021).
      </p>
      <div className="hero-chips">
        {["HRI", "End-User Programming", "AR/VR", "LLM Agents", "Multi-Agent"].map(t => (
          <span key={t} className="chip">{t}</span>
        ))}
      </div>
      <div className="marginalia hero-margin">
        <span className="mono-label">↳ margin note</span>
        <p>Scroll ↓ to try a block-based robot programmer — a miniature of the systems I design.</p>
      </div>
    </section>
  );
}

function ResearchStatement() {
  return (
    <section id="research" className="section research">
      <SectionHead num="01" title="Research statement" />
      <div className="statement">
        <p>
          My research focuses on <strong>human-centered approaches to end-user robot programming</strong>.
          I investigate how to design interactive systems that help users specify, verify, and refine robot
          behavior through three complementary mechanisms:
        </p>
        <ol className="pillars">
          <li className="pillar">
            <div className="pillar-head">
              <span className="pillar-num">i.</span>
              <h3 className="pillar-name">Scaffolding</h3>
            </div>
            <p className="pillar-body">Structures that help users express intent — from block-based vocabularies to guided LLM prompts.</p>
            <span className="pillar-tag">blocks · prompts · templates</span>
          </li>
          <li className="pillar">
            <div className="pillar-head">
              <span className="pillar-num">ii.</span>
              <h3 className="pillar-name">Verification</h3>
            </div>
            <p className="pillar-body">Interfaces that make the robot's interpretation transparent before action — so misalignment is caught early.</p>
            <span className="pillar-tag">previews · critics · dry runs</span>
          </li>
          <li className="pillar">
            <div className="pillar-head">
              <span className="pillar-num">iii.</span>
              <h3 className="pillar-name">Proactivity</h3>
            </div>
            <p className="pillar-body">Systems that anticipate ambiguity and elicit clarification rather than silently guessing.</p>
            <span className="pillar-tag">clarify · question · hedge</span>
          </li>
        </ol>
        <p className="statement-tail">
          This work spans augmented reality interfaces, multi-agent LLM architectures, and empirical studies of how
          people communicate task intent to robots.
        </p>
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section id="demo" className="section demo-section">
      <SectionHead num="02" title="Try it" sub="A small piece of my research, inline." />
      <p className="demo-intro">
        Below is a block-based robot programmer in the spirit of my work. Drag verbs into the program,
        reorder them, and watch the arm execute. It's a five-minute version of the systems I build —
        scaffolded vocabulary, a visible plan, and execution that mirrors intent.
      </p>
      <RobotDemo />
    </section>
  );
}

function PublicationsSection() {
  return (
    <section id="publications" className="section">
      <SectionHead num="03" title="Recent publications" sub="Selected · full list on Google Scholar." />
      <PubList variant="list" />
    </section>
  );
}

function BeyondSection() {
  return (
    <section id="beyond" className="section beyond">
      <SectionHead num="04" title="Beyond research" />
      <p>
        When I'm not working on robots, I enjoy reading and playing games — especially RPGs.
        I come from game development: my undergrad work includes small games I still revisit on my
        <a href="#"> projects page</a>. That background shapes how I think about scaffolding, feedback,
        and the moment a user finally feels competent with a system.
      </p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="mono-label">end of page · thanks for reading</div>
      <div className="foot-links">
        <a href="mailto:cykim6@wisc.edu">cykim6@wisc.edu</a>
        <span className="foot-sep">·</span>
        <a href="#">CV</a>
        <span className="foot-sep">·</span>
        <a href="#">Scholar</a>
        <span className="foot-sep">·</span>
        <span>© 2026 Callie Y. Kim</span>
      </div>
    </footer>
  );
}

function SectionHead({ num, title, sub }) {
  return (
    <header className="sec-head">
      <span className="mono-label sec-num">§ {num}</span>
      <h2 className="sec-title">{title}</h2>
      {sub && <span className="mono-label sec-sub">{sub}</span>}
    </header>
  );
}

// Set grain + density defaults on root (replaces tweaks-panel wiring)
document.documentElement.dataset.density = "comfortable";
document.documentElement.dataset.grain = "on";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
