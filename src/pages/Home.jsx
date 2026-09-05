import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConsultingHome from './ConsultingHome';
import { useMode } from '../context/ModeContext';
import { useReveal, useScrollProgress } from '../hooks/useScrollFx';

import building from '../assets/figma/building.png';
import lignePath from '../assets/figma/ligne-animation.svg';
import stagePath from '../assets/figma/stage-path.svg';
import iconSearch from '../assets/figma/icon-search-status.svg';
import iconMobile from '../assets/figma/icon-mobile.svg';
import iconTick from '../assets/figma/icon-tick-circle.svg';
import iconSetting from '../assets/figma/icon-setting.svg';
import iconDocCode from '../assets/figma/icon-document-code.svg';
import iconCode from '../assets/figma/icon-code.svg';
import iconClipboard from '../assets/figma/icon-clipboard-tick.svg';

import './Home.css';

/* Exact cube coordinates from the Figma "cubs" frame (592 x 569, 51.61px tiles) */
const CUBES = [
  [130.32, 74.83], [130.32, 233.54], [181.93, 339.34], [78.71, 365.14],
  [304.5, 100.64], [336.76, 178.05], [356.11, 339.34], [349.66, 429.65],
  [207.73, 152.25], [263.21, 246.44], [272.24, 332.88], [207.73, 416.75],
  [414.17, 74.83], [454.17, 207.73], [388.37, 250.31], [446.43, 378.04],
];

/* Glass capsules floating around the HQ photo — insets copied from Figma */
const CAPSULES = [
  { label: 'We research', icon: iconSearch, style: { top: '14.46%', left: '4.07%' } },
  { label: 'We prototype', icon: iconMobile, style: { top: '19.33%', left: '57.32%' } },
  { label: 'We prove it', icon: iconTick, style: { top: '36.39%', left: '0%' } },
  { label: 'We operate', icon: iconSetting, style: { top: '41.27%', left: '70.22%' } },
  { label: 'We engineer', icon: iconDocCode, style: { top: '58.16%', left: '7.01%' } },
  { label: 'We deploy', icon: iconCode, style: { top: '63.36%', left: '66.16%' } },
  { label: 'We stay accountable', icon: iconClipboard, style: { top: '87.73%', left: '24.9%' } },
];

const KEYWORDS = [
  '✦ Applied research', '✦ Feasibility', '✦ Prototyping', '✦ Product design',
  '✦ Native mobile', '✦ Real-time', '✦ Applied AI', '✦ Production & scale',
];

const ACCORDIONS = [
  {
    num: '01',
    title: 'Research & feasibility',
    body: 'Before anyone commits a budget, we establish whether the difficult part is possible and what it costs to get there. Technical spikes, applied AI experimentation, algorithm design, a working prototype inside a few weeks. The phase ends with a written report: what we proved, what we could not, and what we would advise against attempting at all. Some engagements stop here, on our recommendation.',
  },
  {
    num: '02',
    title: 'Engineering & operations',
    body: 'Then we build the real thing and keep it standing. Complex web platforms, native mobile, distributed and real-time backends, deployment, scaling and observability. The engineers who designed the system run it in production, take the on-call rotation, and stay accountable for as long as you need us there.',
  },
];

const STEPS = [
  {
    n: '1',
    title: 'Frame',
    rotate: -4,
    lines: [
      'We establish what is actually being asked, which constraints are real and which are only assumed, and what success would look like when it arrives.',
      'Before you commit anything you receive a written scope, a named senior team and a cost envelope.',
    ],
  },
  {
    n: '2',
    title: 'Prove',
    rotate: -13,
    lines: [
      'The step most providers skip. We go after the hardest unknown first, quickly and cheaply, and we report the result honestly whichever way it goes.',
      'Finding out that something cannot be done costs weeks now. It costs years later.',
    ],
  },
  {
    n: '3',
    title: 'Build',
    rotate: 0,
    lines: [
      'Design and engineering run as one loop.',
      'Working software in a real environment, every week.',
      'Progress gets demonstrated rather than reported.',
    ],
  },
  {
    n: '4',
    title: 'Operate',
    rotate: -13,
    lines: [
      'Deployment, scaling, monitoring, incident response.',
      'Launch is where the engagement starts, not where it ends.',
    ],
  },
];

const MAKE_IT_REAL = [
  'Web platforms, native iOS & Android',
  'Observability, incident response & on-call',
  'Distributed & real-time backends',
  'Documented handover, or none if we stay',
  'Production infrastructure & CI/CD',
];

const INVENT = [
  'Concept framing & feasibility analysis',
  'Rapid prototyping in days',
  'Applied research & technical spikes',
  'Written feasibility report & cost envelope',
  'Algorithm and system design',
];

const Home = () => {
  const { mode } = useMode();
  const isConsulting = mode === 'consulting';

  useReveal([mode]);
  useScrollProgress([mode]);

  if (isConsulting) return <ConsultingHome />;

  return (
    <div className="hm-root">
      <Navbar />

      {/* ============================ HERO ============================ */}
      <section className="hm-hero">
        <span className="u-glow hm-hero-glow" aria-hidden="true" />

        <div className="hm-shell">
          <h1 className="hm-hero-title">
            <span className="hm-hero-line">We build.</span>
            <span className="hm-hero-line">We operate.</span>
            <span className="hm-hero-line">
              We <em className="u-outline hm-hero-outline">scale.</em>
            </span>
          </h1>

          <div className="hm-hero-row">
            <div className="hm-hero-copy reveal">
              <p>
                <strong>ADNC</strong> is not a software company.
                <br />
                We are a research and engineering lab. Clients come to us with the work nobody else
                would take on: the system that has no precedent, the constraint everyone said was
                unreachable.
                <br />
                We find out whether it can be done, we build it if it can, and then we run it in
                production for as long as you need us there.
                <br />
                Every engagement starts with a written scope and a senior engineer whose name stays
                on it until the last day.
              </p>
            </div>

            <div className="hm-cubes" aria-hidden="true">
              {CUBES.map(([x, y], i) => (
                <span
                  key={`${x}-${y}`}
                  className="hm-cube"
                  style={{
                    left: `${(x / 592) * 100}%`,
                    top: `${(y / 569) * 100}%`,
                    animationDelay: `${(i % 8) * 0.18}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="hm-hero-actions reveal">
            <Link to="/contact" className="btn-pill">Bring us the hard problem →</Link>
            <Link to="/process" className="btn-pill btn-pill--ghost">How we work</Link>
          </div>
        </div>
      </section>

      {/* ========================= ADNC MARQUEE ======================== */}
      <div className="hm-marquee hm-marquee--adnc" aria-hidden="true">
        <div className="hm-marquee-track">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i}>ADNC</span>
          ))}
        </div>
      </div>

      {/* ======================= HQ + CAPSULES ========================= */}
      <section className="hm-hq">
        <div className="hm-hq-stage reveal-scale">
          <div className="hm-hq-photo">
            <img src={building} alt="ADNC Group headquarters at night" />
          </div>

          {CAPSULES.map(({ label, icon, style }, i) => (
            <div
              className="hm-capsule"
              key={label}
              style={{ ...style, transitionDelay: `${0.12 * i}s` }}
            >
              <span className="hm-capsule-icon">
                <img src={icon} alt="" />
              </span>
              <span className="hm-capsule-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================= ONE PARTNER ========================= */}
      <div className="hm-partner reveal">
        <p className="hm-partner-title">One partner</p>
        <p className="hm-partner-sub">Nothing off the shelf.</p>
      </div>

      {/* ===================== TWO STACKED CARDS ======================= */}
      <section className="hm-duo">
        <div className="hm-duo-line" data-scroll-progress data-start="0.95" data-end="0.15">
          <img src={lignePath} alt="" aria-hidden="true" />
        </div>

        <div className="hm-duo-stage">
          <article className="hm-duo-card hm-duo-card--back reveal-left">
            <h3 className="u-outline-dark hm-duo-title">Make it real.</h3>
            <p className="hm-duo-body">
              An idea becomes real the day a stranger uses it at three in the morning and nothing
              breaks. We engineer it, we deploy it, we instrument it, and we take the on-call
              rotation ourselves. The engineers who designed your system are the ones who answer
              when it fails. In our experience that is the only arrangement which reliably produces
              systems that do not.
            </p>
            <div className="hm-duo-tags">
              {MAKE_IT_REAL.map((t) => <span key={t}>{t}</span>)}
            </div>
          </article>

          <article className="hm-duo-card hm-duo-card--front reveal-right">
            <h3 className="u-outline-dark hm-duo-title">Invent.</h3>
            <p className="hm-duo-body">
              Most teams build what you describe. We get called in when nobody can describe it yet.
              So we start at the version everyone calls impossible and work backwards from there,
              separating what is genuinely unknown from what only looks that way. You get that
              analysis in writing before we commit a single line of production code.
            </p>
            <div className="hm-duo-tags">
              {INVENT.map((t) => <span key={t}>{t}</span>)}
            </div>
          </article>
        </div>
      </section>

      {/* ===================== SERVICES ACCORDIONS ===================== */}
      <section className="hm-services" id="services">
        <div className="hm-services-head reveal">
          <h2>
            <span>Research and engineering</span>
            <span className="u-outline">under one roof</span>
          </h2>
          <Link to="/services" className="btn-pill hm-services-btn">View all services</Link>
        </div>

        <div className="hm-acc">
          {ACCORDIONS.map(({ num, title, body }) => (
            <details className="hm-acc-item reveal" key={num}>
              <summary>
                <span className="hm-acc-title">{title}</span>
                <span className="hm-acc-num">{num}</span>
              </summary>
              <div className="hm-acc-body"><p>{body}</p></div>
            </details>
          ))}
        </div>
      </section>

      <div className="hm-marquee hm-marquee--kw" aria-hidden="true">
        <div className="hm-marquee-track hm-marquee-track--rev">
          {[...KEYWORDS, ...KEYWORDS, ...KEYWORDS].map((k, i) => (
            <span key={`${k}-${i}`}>{k}</span>
          ))}
        </div>
      </div>

      {/* ================= FROM AN IDEA → PRODUCTION =================== */}
      <section className="hm-arc">
        <div className="hm-arc-rows">
          <div className="hm-arc-row hm-arc-row--from reveal-left">
            <span>From an</span>
            <b>unproven idea</b>
          </div>
          <div className="hm-arc-row hm-arc-row--to reveal-right">
            <span>a</span>
            <b>system</b>
            <span>in production.</span>
          </div>
        </div>

        <div className="hm-stage">
          <div className="hm-stage-line" data-scroll-progress data-start="0.9" data-end="0.2">
            <img src={stagePath} alt="" aria-hidden="true" />
          </div>

          <div className="hm-stage-cards">
            {STEPS.map(({ n, title, rotate, lines }, i) => (
              <article
                className="hm-step reveal"
                key={n}
                style={{ '--rot': `${rotate}deg`, transitionDelay: `${i * 0.12}s` }}
              >
                <span className="hm-step-num" aria-hidden="true">{n}</span>
                <h4 className="u-outline-dark hm-step-title">{title}</h4>
                <div className="hm-step-body">
                  {lines.map((l) => <p key={l}>{l}</p>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ADVISORY CROSS-SELL ===================== */}
      <section className="hm-advisory">
        <div className="hm-advisory-inner reveal">
          <h2>
            Not sure the idea is the right one yet?
            <span>Our advisory practice can tell you before you build it.</span>
          </h2>
          <Link to="/contact" className="hm-advisory-link">
            <span>Consulting</span>
            <svg viewBox="0 0 24 16" aria-hidden="true" width="23" height="15">
              <path d="M1 8h20M15 1l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* =========================== BIG CTA ========================== */}
      <section className="hm-cta" id="contact">
        <span className="u-glow hm-cta-glow" aria-hidden="true" />
        <div className="hm-cta-inner reveal">
          <h2 className="hm-cta-title">
            <span>Got something</span>
            <span className="u-outline">nobody will take on?</span>
          </h2>
          <p className="hm-cta-desc">
            Describe the problem rather than the specification. You get back a senior technical
            opinion, an honest read on what is still unproven, an indicative scope, and the names of
            the engineers who would do the work. We answer within one business day, and we say no
            when we should.
          </p>
          <div className="hm-cta-action">
            <Link to="/contact" className="btn-pill btn-pill--lg">Bring us the hard problem</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
