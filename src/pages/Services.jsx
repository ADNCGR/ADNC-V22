import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConsultingFooter from '../components/ConsultingFooter';
import { useMode } from '../context/ModeContext';
import { useReveal } from '../hooks/useScrollFx';
import DecisionSlot from '../components/DecisionSlot';

import heroBg from '../assets/hero-services.jpg';
import pin from '../assets/figma/pin.png';

import './Services.css';

/* ================================================================
   PAGE 2 — THE LAB / SERVICES (mode Development) — Figma 22:2720
   ================================================================ */

const INPUT_LINES = [
  '[01]: Idea excavation & concept framing',
  '[02]: Applied research & technical spikes',
  '[03]: AI / ML experimentation',
  '[04]: Algorithm & system design',
  '[05]: Rapid prototyping',
];

const OUTPUT_LINES = [
  '[01]: Complex web platforms (React, Next, TanStack)',
  '[02]: Native iOS (Swift, SwiftUI) & Android (Kotlin, Compose)',
  '[03]: Distributed & real-time backends',
  '[04]: Deployment, scaling & observability',
  '[05]: Security, incident response & on-call',
];

const PASS_LINES = [
  '[PASS]: Systems with no precedent.',
  '[PASS]: Constraints the market has decided are unreachable.',
  '[PASS]: Problems sitting between two fields that nobody has connected.',
  '[PASS]: Projects other teams have already declared unsalvageable.',
];

const REJECT_LINES = [
  '[REJECTED]: Template work, and copies of things\n            that already exist.',
  '[REJECTED]: Engagements where the outcome rests on assumptions\n            we are not allowed to test.',
  '[REJECTED]: Anything we cannot do exceptionally well.',
  '[REJECTED]: We would rather send you to someone better\n            than deliver you something adequate.',
];

const OFFERS = [
  {
    title: 'Feasibility\nengagement',
    body: 'A fixed scope research phase that ends in a written report. Often the most useful money a client spends with us.',
  },
  {
    title: 'Build\nwith us',
    body: 'You hold the vision. We bring the senior team and take it to production.',
  },
  {
    title: 'Build and\noperate',
    body: 'We design it, build it and run it. One team, one accountability, no handover.',
  },
  {
    title: 'Recover and\nrebuild',
    body: 'A stalled or broken project, inherited without judgment, stabilised, and shipped.',
  },
];

const DevelopmentServices = () => {
  const [declined, setDeclined] = useState(false);
  useReveal([declined]);

  return (
    <div className="sv-root">
      <Navbar />

      {/* -------------------------------- HERO -------------------------------- */}
      <header className="sv-hero">
        <div className="sv-hero-media">
          <img src={heroBg} alt="ADNC engineering and research lab" />
        </div>

        <div className="sv-hero-copy reveal">
          <h1>
            A lab, not a <em className="u-outline">factory</em>.
          </h1>
          <p>
            A factory takes a specification and returns a build.
            <br />
            A lab takes a question and returns something that did not exist before, along with an
            honest account of what it cost to find out.
          </p>
          <p className="sv-hero-claim">ADNC is built as a lab.</p>
          <p>Research first, engineering second, operations for as long as you need us.</p>
        </div>
      </header>

      {/* ------------------------------ TERMINALS ----------------------------- */}
      <section className="sv-terminals reveal">
        <div className="sv-term sv-term--in">
          <h2># INPUT: Research &amp; Innovation</h2>
          <ul>
            {INPUT_LINES.map((l, i) => (
              <li key={l} style={{ '--i': i }}>{l}</li>
            ))}
          </ul>
          <button type="button" className="sv-term-btn">
            Run
            <svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true">
              <path d="M4 14h18M15 7l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="sv-term sv-term--out">
          <h2># OUTPUT: Engineering &amp; Production</h2>
          <ul>
            {OUTPUT_LINES.map((l, i) => (
              <li key={l} style={{ '--i': i }}>{l}</li>
            ))}
          </ul>
          <button type="button" className="sv-term-btn sv-term-btn--sm">
            <svg viewBox="0 0 28 28" width="18" height="18" aria-hidden="true">
              <path d="M24 14H6M13 7l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Source
          </button>
        </div>
      </section>

      {/* --------------------------- WHAT WE TAKE ON -------------------------- */}
      <section className="sv-take reveal">
        {/* Figma keeps the decline panel parked off to the right at opacity 0 —
            switching tabs slides the whole track across. */}
        <div className="sv-take-panel">
          <div className="sv-take-track" style={{ transform: `translateX(${declined ? '-50%' : '0%'})` }}>
            <div className={`sv-take-view${declined ? '' : ' is-active'}`}>
              <span className="sv-take-mark u-outline" aria-hidden="true">[PASS]</span>
              <h2># What we take on</h2>
              <ul>
                {PASS_LINES.map((l, i) => <li key={l} style={{ '--i': i }}>{l}</li>)}
              </ul>
            </div>
            <div className={`sv-take-view${declined ? ' is-active' : ''}`}>
              <span className="sv-take-mark u-outline" aria-hidden="true">[REJECTED]</span>
              <h2># What we decline</h2>
              <ul>
                {REJECT_LINES.map((l, i) => <li key={l} style={{ '--i': i }}>{l}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="sv-take-tab"
          onClick={() => setDeclined((v) => !v)}
          aria-label={declined ? 'Show what we take on' : 'Show what we decline'}
        >
          <span className="u-outline-dark">{declined ? '[PASS]' : '[REJECTED]'}</span>
        </button>
      </section>

      {/* ------------------------------ OFFER GRID ---------------------------- */}
      <section className="sv-grid reveal">
        {OFFERS.map(({ title, body }) => (
          <article className="sv-cell" key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </section>

      {/* --------------------------------- CTA -------------------------------- */}
      <div className="sv-cta-wrap reveal">
        <Link to="/contact" className="sv-cta">
          <span className="sv-cta-arrow sv-cta-arrow--l" aria-hidden="true">→</span>
          <span>Discuss your project</span>
          <span className="sv-cta-arrow sv-cta-arrow--r" aria-hidden="true">→</span>
        </Link>
      </div>

      <Footer />
    </div>
  );
};

/* ================================================================
   PAGE 2 — PRACTICE / SERVICES (mode Consulting) — Figma 22:3548
   ================================================================ */

const PRACTICE_LEFT = [
  'Data audit & instrumentation',
  'Forecasting & predictive modelling',
  'Decision structuring & scenario modelling',
  'Risk quantification & sensitivity analysis',
  'KPI frameworks & executive reporting',
];

const PRACTICE_RIGHT = [
  'Digital strategy & transformation roadmaps',
  'Independent technology & architecture audit',
  'Cloud & infrastructure planning',
  'Business plans & financial modelling',
  'Investment appraisal & operational audits',
];

const ENGAGEMENTS = [
  {
    title: 'Single decision assessment',
    body: 'A fixed scope engagement on one defined decision, ending in a written recommendation to the sponsoring body.',
    rotate: -2.84,
    pin: 'left',
  },
  {
    title: 'Advisory and delivery',
    body: 'Where implementation follows, the organisation that gave the advice stays accountable for delivering it.',
    rotate: 1.87,
    pin: 'center',
  },
  {
    title: 'Advisory retainer',
    body: 'Continuous access to the practice for organisations working through a sequence of related decisions.',
    rotate: 6.51,
    pin: 'right',
  },
];

const ConsultingServices = () => {
  useReveal([]);

  return (
    <div className="cs-root sv-c-root">
      <Navbar />

      <main>
        <section className="sv-c-hero">
          <h1 className="reveal">
            <span className="u-outline-dark">Any</span> sector.
            <br />
            The <span className="u-outline-dark">same</span> discipline.
          </h1>
          <p className="reveal">
            A public authority weighing a modernisation programme and a restaurant group weighing a
            fourth site are facing the same problem in different clothing. An irreversible
            commitment, made on incomplete information, with competing opinions inside the
            organisation. Decision science exists for exactly this. We bring it to organisations that
            have rarely had access to it.
          </p>
        </section>

        {/* ------------------------- THE EQUATION -------------------------
            Figma note 22:2809 asks for the words to cycle until they settle on
            the result of the calculation — built as a slot machine: sector ×
            method = outcome, and only the method decides the outcome. */}
        <DecisionSlot />

        {/* ------------------------ PRACTICE AREAS ------------------------ */}
        <section className="sv-c-practice">
          <div className="sv-c-col reveal-left">
            <h2>Data <span className="u-outline-dark">&amp;</span> Decision Sciences</h2>
            <ul>
              {PRACTICE_LEFT.map((item) => <li key={item}>-&nbsp; {item}</li>)}
            </ul>
          </div>

          <span className="sv-c-divider" aria-hidden="true" />

          <div className="sv-c-col reveal-right">
            <h2>Strategy, Technology <span className="u-outline-dark">&amp;</span> Finance</h2>
            <ul>
              {PRACTICE_RIGHT.map((item) => <li key={item}>-&nbsp; {item}</li>)}
            </ul>
          </div>
        </section>

        {/* ------------------------- ENGAGEMENTS -------------------------- */}
        <section className="sv-c-cards">
          {ENGAGEMENTS.map(({ title, body, rotate, pin: pinPos }, i) => (
            <article
              className="sv-c-card reveal"
              key={title}
              style={{ '--rot': `${rotate}deg`, transitionDelay: `${i * 0.1}s` }}
            >
              <img src={pin} alt="" className={`sv-c-pin sv-c-pin--${pinPos}`} aria-hidden="true" />
              <h3 className="u-outline-dark">{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </section>

        <div className="sv-c-cta reveal">
          <Link to="/contact" className="btn-square sv-c-cta-btn">
            Discuss your situation <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>

      <ConsultingFooter />
    </div>
  );
};

const Services = () => {
  const { mode } = useMode();
  return mode === 'consulting' ? <ConsultingServices /> : <DevelopmentServices />;
};

export default Services;
