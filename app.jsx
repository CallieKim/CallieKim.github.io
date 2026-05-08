/* global React, ReactDOM, RobotDemo, PubList, useState, useEffect */

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
          <ProjectsSection />
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
          <a href="#about" className="nav-item">
            <span className="nav-num">01</span> About
          </a>
          <a href="#demo" className="nav-item">
            <span className="nav-num">02</span> Demo
          </a>
          <a href="#publications" className="nav-item">
            <span className="nav-num">03</span> Publications
          </a>
          <a href="#projects" className="nav-item">
            <span className="nav-num">04</span> Projects
          </a>
          <a href="files/resume_update_website.pdf" className="nav-item">
            <span className="nav-num">05</span> CV
          </a>
        </nav>
      </div>
    </header>
  );
}

function LeftRail() {
  return (
    <aside className="rail">
      <div className="rail-avatar" aria-hidden="true">
        <img src="images/profile_real.png" alt="" className="avatar-img" />
      </div>
      <div className="rail-id">
        <div className="mono-label">researcher</div>
        <div className="rail-name">Callie Yejin Kim</div>
        <div className="rail-role">PhD Candidate · Computer Science</div>
      </div>
      <dl className="rail-facts">
        <div className="fact">
          <dt>loc</dt>
          <dd>Madison, WI</dd>
        </div>
        <div className="fact">
          <dt>lab</dt>
          <dd>People & Robots Lab</dd>
        </div>
        <div className="fact">
          <dt>advisor</dt>
          <dd>Bilge Mutlu</dd>
        </div>
        <div className="fact">
          <dt>year</dt>
          <dd>5 / expected 2027</dd>
        </div>
      </dl>
      <div className="rail-links">
        <div className="mono-label">contact</div>
        <a href="mailto:cykim6@wisc.edu" className="rail-link">
          cykim6@wisc.edu<span className="arr">↗</span>
        </a>
        <a
          href="https://scholar.google.com/citations?user=CbMSclwAAAAJ&hl=en"
          className="rail-link"
        >
          Google Scholar<span className="arr">↗</span>
        </a>
        <a href="https://github.com/CallieKim" className="rail-link">
          GitHub<span className="arr">↗</span>
        </a>
        <a href="https://orcid.org/0009-0001-4195-8317" className="rail-link">
          ORCID<span className="arr">↗</span>
        </a>
        <a
          href="https://www.linkedin.com/in/callie-kim-608418182"
          className="rail-link"
        >
          LinkedIn<span className="arr">↗</span>
        </a>
        <a
          href="files/resume_update_website.pdf"
          className="rail-link rail-link-primary"
        >
          CV (pdf)<span className="arr">↓</span>
        </a>
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
      <SectionHead title="About" />
      <div className="hero-meta">
        <span className="mono-label">last updated · apr 2026</span>
      </div>
      <h1 className="hero-title">
        I study how people <em>communicate intent</em> to robots — and how
        robots can ask better questions back.
      </h1>
      <p className="hero-lede">
        Fifth-year PhD candidate in the{" "}
        <a href="https://peopleandrobots.wisc.edu/">
          People and Robots Laboratory
        </a>{" "}
        at the University of Wisconsin–Madison, advised by{" "}
        <a href="http://bilgemutlu.com">Bilge Mutlu</a>. Previously BS at Ewha
        Womans University (2019) and MS at the University of Maryland (2021).
      </p>
      <div className="hero-chips">
        {[
          "HRI",
          "End-User Programming",
          "AR/VR",
          "LLM Agents",
          "Multi-Agent",
        ].map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
      <div className="marginalia hero-margin">
        <span className="mono-label">↳ margin note</span>
        <p>
          Scroll ↓ to try a block-based robot programmer — a miniature of the
          systems I design.
        </p>
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
          My research focuses on{" "}
          <strong>
            human-centered approaches to end-user robot programming
          </strong>
          . I investigate how to design interactive systems that help users
          specify, verify, and refine robot behavior through three complementary
          mechanisms:
        </p>
        <ol className="pillars">
          <li className="pillar">
            <div className="pillar-head">
              <span className="pillar-num">i.</span>
              <h3 className="pillar-name">Scaffolding</h3>
            </div>
            <p className="pillar-body">
              Structures that help users express intent — from block-based
              vocabularies to guided LLM prompts.
            </p>
            <span className="pillar-tag">blocks · prompts · templates</span>
          </li>
          <li className="pillar">
            <div className="pillar-head">
              <span className="pillar-num">ii.</span>
              <h3 className="pillar-name">Verification</h3>
            </div>
            <p className="pillar-body">
              Interfaces that make the robot's interpretation transparent before
              action — so misalignment is caught early.
            </p>
            <span className="pillar-tag">previews · critics · dry runs</span>
          </li>
          <li className="pillar">
            <div className="pillar-head">
              <span className="pillar-num">iii.</span>
              <h3 className="pillar-name">Proactivity</h3>
            </div>
            <p className="pillar-body">
              Systems that anticipate ambiguity and elicit clarification rather
              than silently guessing.
            </p>
            <span className="pillar-tag">clarify · question · hedge</span>
          </li>
        </ol>
        <p className="statement-tail">
          This work spans augmented reality interfaces, multi-agent LLM
          architectures, and empirical studies of how people communicate task
          intent to robots.
        </p>
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section id="demo" className="section demo-section">
      <SectionHead
        num="02"
        title="Try it"
        sub="A small piece of my research, inline."
      />
      <p className="demo-intro">
        Below is a block-based robot programmer in the spirit of my work. Drag
        verbs into the program, reorder them, and watch the arm execute. It's a
        five-minute version of the systems I build — scaffolded vocabulary, a
        visible plan, and execution that mirrors intent.
      </p>
      <RobotDemo />
    </section>
  );
}

function PublicationsSection() {
  return (
    <section id="publications" className="section">
      <SectionHead
        num="03"
        title="Recent publications"
        sub="Selected · full list on Google Scholar."
      />
      <PubList variant="list" />
    </section>
  );
}

const RESEARCH_PROJECTS = [
  {
    id: "robocritics",
    title: "RoboCritics",
    img: "images/robocritics-teaser.png",
    blurb:
      "LLM robot programming augmented with expert-informed motion-level critics that catch unsafe execution and surface one-click fixes.",
    href: "https://wisc-hci.github.io/RoboCritics/",
  },
  {
    id: "roboblocks",
    title: "RoboBlocks",
    img: "images/roboblocks_title.jpg",
    blurb:
      "Block-based scaffolding system that helps non-expert users express task intent for robot programming.",
    href: "https://robo-blocks.com/",
  },
  {
    id: "coframear",
    title: "CoframeAR",
    img: "images/CoframeAR_title.jpeg",
    blurb: "Robot programming interface in AR for novice programmers.",
    href: null,
  },
  {
    id: "vrmask",
    title: "Custom VR Headset",
    img: "images/custom_vr_mask_title.PNG",
    blurb: "VR headset designed to accommodate people with visual impairments.",
    href: null,
  },
];

const GAME_PROJECTS = [
  {
    id: "virtual-disaster",
    title: "Virtual Disaster",
    img: "images/virtual_disaster_title.PNG",
    meta: "Mobile VR · Simulation · Unity · 2018",
    href: "https://github.com/CallieKim/Virtual-Disaster",
  },
  {
    id: "letter",
    title: "Letter",
    img: "images/letter_title.JPG",
    meta: "PC · Mystery · RPG Maker · 2018",
    href: null,
  },
  {
    id: "bear-farm",
    title: "Bear Farm",
    img: "images/bear_farm_title.PNG",
    meta: "Mobile VR · Casual · Unity · 2018",
    href: null,
  },
  {
    id: "school-simulation",
    title: "Undergraduate Simulation",
    img: "images/school_sim_title.JPG",
    meta: "PC · Simulation · Unity · 2017",
    href: "https://github.com/CallieKim/School-Bomb",
  },
  {
    id: "survive",
    title: "Survive",
    img: "images/survive_title.png",
    meta: "Android · Survival · Unity · 2017",
    href: "https://github.com/CallieKim/Survive",
  },
];

function ProjectCard({ p }) {
  const Tag = p.href ? "a" : "div";
  const linkProps = p.href
    ? { href: p.href, target: "_blank", rel: "noreferrer" }
    : {};
  return (
    <Tag className="proj-card" {...linkProps}>
      <div className="proj-thumb">
        <img src={p.img} alt={p.title} loading="lazy" />
      </div>
      <div className="proj-info">
        <h4 className="proj-title">{p.title}</h4>
        {p.meta && <span className="mono-label proj-meta">{p.meta}</span>}
        {p.blurb && <p className="proj-blurb">{p.blurb}</p>}
        {p.href && <span className="mono-label proj-link">visit ↗</span>}
      </div>
    </Tag>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="section projects">
      <SectionHead
        num="04"
        title="Projects"
        sub="Research systems and undergrad games."
      />
      <h3 className="proj-group-head">
        <span className="mono-label">research</span>
      </h3>
      <div className="proj-grid">
        {RESEARCH_PROJECTS.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
      <h3 className="proj-group-head">
        <span className="mono-label">game development</span>
      </h3>
      <div className="proj-grid">
        {GAME_PROJECTS.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}

function BeyondSection() {
  return (
    <section id="beyond" className="section beyond">
      <SectionHead num="05" title="Beyond research" />
      <p>
        When I'm not working on robots, I enjoy reading and playing games —
        especially RPGs. I come from game development: my undergrad work
        includes small games I still revisit in
        <a href="#projects"> projects</a>. That background shapes how I think
        about scaffolding, feedback, and the moment a user finally feels
        competent with a system.
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
        <a href="files/resume_update_website.pdf">CV</a>
        <span className="foot-sep">·</span>
        <a href="https://scholar.google.com/citations?user=CbMSclwAAAAJ&hl=en">
          Scholar
        </a>
        <span className="foot-sep">·</span>
        <span>© 2026 Callie Y. Kim</span>
      </div>
    </footer>
  );
}

function SectionHead({ title, sub }) {
  return (
    <header className="sec-head">
      <h2 className="sec-title">{title}</h2>
      {sub && <span className="mono-label sec-sub">{sub}</span>}
    </header>
  );
}

// Set grain + density defaults on root (replaces tweaks-panel wiring)
document.documentElement.dataset.density = "comfortable";
document.documentElement.dataset.grain = "on";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
