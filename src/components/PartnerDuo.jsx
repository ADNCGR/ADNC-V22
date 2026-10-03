import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './PartnerDuo.css';

/* ------------------------------------------------------------------
   "One partner" — the two halves of ADNC, side by side:
   a white card for the research half, a black one for the engineering
   half, joined by an arrow because one team takes you across.
   They are dealt in when the block is properly on screen, their
   content follows in a cascade, and each card leans towards the
   pointer.
   ------------------------------------------------------------------ */

const CARDS = [
  {
    id: 'invent',
    tone: 'light',
    num: '01',
    title: 'Invent.',
    lead: 'We start where everyone says “impossible”, and tell you in writing what can really be built — before a single line of production code.',
    chips: [
      'Concept framing', 'Feasibility analysis', 'Technical spikes',
      'Prototypes in days', 'Algorithm & system design', 'Written report & cost envelope',
    ],
    to: '/process',
    cta: 'How we prove it',
  },
  {
    id: 'real',
    tone: 'dark',
    num: '02',
    title: 'Make it real.',
    lead: 'Real means a stranger uses it at 3 a.m. and nothing breaks. We build it, ship it, and answer the pager ourselves.',
    chips: [
      'Web platforms', 'Native iOS & Android', 'Real-time backends',
      'Infrastructure & CI/CD', 'Observability & on-call', 'Documented handover',
    ],
    to: '/services',
    cta: 'What we build',
  },
];

/* research: a sketch of orbits around a crosshair */
const OrbitMotif = () => (
  <svg className="pd-motif pd-motif--orbit" viewBox="0 0 200 200" aria-hidden="true">
    <g className="pd-orbit-spin">
      <circle cx="100" cy="100" r="92" />
      <circle cx="100" cy="100" r="64" />
      <circle cx="100" cy="100" r="36" />
    </g>
    <path className="pd-orbit-cross" d="M100 0v200M0 100h200" />
    <g className="pd-orbit-dot">
      <circle cx="164" cy="100" r="5" />
    </g>
    <g className="pd-orbit-dot pd-orbit-dot--slow">
      <circle cx="100" cy="8" r="3.5" />
    </g>
  </svg>
);

/* operations: a pulse that never flat-lines */
const PulseMotif = () => (
  <svg className="pd-motif pd-motif--pulse" viewBox="0 0 320 80" aria-hidden="true" preserveAspectRatio="none">
    <path d="M0 48H86l12-30 16 52 14-40 10 18H320" />
  </svg>
);

const PartnerDuo = () => {
  const stage = useRef(null);
  // without IntersectionObserver the cards are simply there
  const noObserver = typeof IntersectionObserver === 'undefined';
  const [shown, setShown] = useState(() => CARDS.map(() => noObserver));
  const [settled, setSettled] = useState(noObserver);
  const allShown = shown.every(Boolean);

  // each card is dealt in once a good part of it is on screen, not at its
  // first pixel — side by side they arrive together, stacked one at a time
  useEffect(() => {
    const node = stage.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    const cards = Array.from(node.querySelectorAll('.pd-card'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const index = cards.indexOf(entry.target);
        setShown((prev) => prev.map((on, i) => on || i === index));
      });
    }, { threshold: 0.3 });
    cards.forEach((card) => io.observe(card));
    return () => io.disconnect();
  }, []);

  // once the entrance has played, hover reacts without the entrance delays
  useEffect(() => {
    if (!allShown || settled) return undefined;
    const timer = window.setTimeout(() => setSettled(true), 2600);
    return () => window.clearTimeout(timer);
  }, [allShown, settled]);

  // the card leans towards the pointer and a glare follows it
  const lean = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const box = el.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width;
    const y = (e.clientY - box.top) / box.height;
    el.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
  };

  const straighten = (e) => {
    const el = e.currentTarget;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };

  return (
    <div
      ref={stage}
      className={`pd-stage${allShown ? ' is-in' : ''}${settled ? ' is-settled' : ''}`}
      data-fx-skip=""
    >
      {CARDS.map((card, k) => (
        <React.Fragment key={card.id}>
          {k === 1 && (
            <span className="pd-join" aria-hidden="true">
              <svg viewBox="0 0 28 28" width="26" height="26">
                <path d="M4 14h18M15 7l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          <article className={`pd-card pd-card--${card.tone}${shown[k] ? ' is-in' : ''}`} style={{ '--k': k }}>
            <div className="pd-card-inner" onPointerMove={lean} onPointerLeave={straighten}>
              <span className="pd-glare" aria-hidden="true" />
              {card.tone === 'light' ? <OrbitMotif /> : <PulseMotif />}

              {/* the step number, large and faint, behind the copy */}
              <span className="pd-num" aria-hidden="true">{card.num}</span>
              <h3 className="pd-title">
                <span className={card.tone === 'light' ? 'u-outline-dark' : 'u-outline'}>{card.title}</span>
              </h3>
              <p className="pd-lead">{card.lead}</p>

              <ul className="pd-chips">
                {card.chips.map((chip, j) => <li key={chip} style={{ '--j': j }}>{chip}</li>)}
              </ul>

              <Link to={card.to} className="pd-link">
                {card.cta}
                <svg viewBox="0 0 28 28" width="20" height="20" aria-hidden="true">
                  <path d="M4 14h18M15 7l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </article>
        </React.Fragment>
      ))}
    </div>
  );
};

export default PartnerDuo;
