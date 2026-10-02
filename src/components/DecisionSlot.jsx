import React, { useCallback, useEffect, useRef, useState } from 'react';
import leverBall from '../assets/figma/3dicons.png';
import './DecisionSlot.css';

/* ------------------------------------------------------------------
   The consulting equation as a slot machine:
       sector  ×  method  =  outcome
   The sector never changes the outcome — only the method does. A data
   methodology pays out "Proven Decision"; anything else pays out the
   matching bad result. RESULTS is index-aligned with METHODS.
   ------------------------------------------------------------------ */

const SECTORS = [
  'Public Authority',
  'Restaurant Group',
  'Hospital Network',
  'Logistics Operator',
  'Retail Chain',
  'Energy Utility',
];

const METHODS = [
  'Fixed Data Methodology',
  'Assumption',
  'Gut Feeling / Intuition',
  'Market Hype',
];

const RESULTS = ['Proven Decision', 'Untested Bet', 'Costly Guess', 'Expensive Detour'];

const GOOD = 0;                       // index of the winning method / result
const REELS = [SECTORS, METHODS, RESULTS];
const CYCLES = 8;                     // copies of each list in a strip
const TURNS = [2, 3, 4];              // full turns before each reel stops
const DURATIONS = [1300, 1900, 2500]; // ms — reels stop left to right

const pick = (n, except) => {
  let i = Math.floor(Math.random() * n);
  if (i === except) i = (i + 1) % n;
  return i;
};

const Icon = ({ good }) =>
  good ? (
    <svg viewBox="0 0 23 18" width="22" height="17" aria-hidden="true">
      <path d="M7.26 17.84L0 10.58L3.16 7.58L7.26 11.69L18.95 0L22.11 3.16L7.26 17.84Z" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 18 18" width="17" height="17" aria-hidden="true">
      <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" fill="none" />
    </svg>
  );

const DecisionSlot = () => {
  const root = useRef(null);
  const strips = useRef([]);
  const pos = useRef(REELS.map((list) => list.length));  // row centred in each reel
  const timers = useRef([]);
  const busy = useRef(false);
  const [landed, setLanded] = useState([0, GOOD, GOOD]);
  const [phase, setPhase] = useState('good');             // spinning | good | bad
  const [pulled, setPulled] = useState(false);

  const later = (fn, ms) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  const spin = useCallback((sector, method, onDone) => {
    if (busy.current) return;
    busy.current = true;
    const targets = [sector, method, method];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPhase('spinning');

    targets.forEach((target, i) => {
      const el = strips.current[i];
      const len = REELS[i].length;
      // rewind to the same face in the first copy (invisible: the strip repeats)
      const base = (pos.current[i] % len) + len;
      const next = base + (reduced ? 0 : TURNS[i] * len) + ((target - (base % len) + len) % len);
      el.style.transition = 'none';
      el.style.setProperty('--pos', base);
      el.getBoundingClientRect();
      el.style.transition = reduced ? 'none' : `transform ${DURATIONS[i]}ms cubic-bezier(0.1, 0.7, 0.1, 1)`;
      el.style.setProperty('--pos', next);
      pos.current[i] = next;
    });

    later(() => {
      busy.current = false;
      setLanded(targets);
      setPhase(method === GOOD ? 'good' : 'bad');
      if (onDone) onDone();
    }, reduced ? 0 : DURATIONS[2] + 60);
  }, []);

  // First time the machine scrolls into view: one losing spin, then the
  // winning one, so the visitor sees both outcomes before touching anything.
  useEffect(() => {
    const node = root.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        spin(pick(SECTORS.length), 1 + pick(METHODS.length - 1), () => {
          later(() => spin(pick(SECTORS.length), GOOD), 1500);
        });
      },
      { threshold: 0.6 }
    );
    io.observe(node);
    const pending = timers.current;
    return () => {
      io.disconnect();
      pending.forEach((id) => window.clearTimeout(id));
    };
  }, [spin]);

  const pull = () => {
    if (busy.current) return;
    setPulled(true);
    later(() => setPulled(false), 520);
    // after a win the next pull loses; after a loss it wins a bit more often than not
    const wasGood = landed[1] === GOOD;
    const method = wasGood || Math.random() > 0.6 ? pick(METHODS.length, GOOD) : GOOD;
    spin(pick(SECTORS.length, landed[0]), method === landed[1] ? pick(METHODS.length, method) : method);
  };

  const settled = phase === 'good' || phase === 'bad';

  return (
    <section className="ds" ref={root} data-phase={phase} aria-label="Our method at a glance">
      <span className="ds-band" aria-hidden="true" />

      <div className="ds-machine" aria-hidden="true">
        {REELS.map((list, r) => (
          <React.Fragment key={r}>
            {r > 0 && <span className="ds-op">{r === 1 ? '×' : '='}</span>}
            <div className={`ds-reel ds-reel--${['sector', 'method', 'result'][r]}`}>
              {r !== 1 && <span className="ds-window" />}
              <div
                className="ds-strip"
                ref={(el) => { strips.current[r] = el; }}
                style={{ '--pos': list.length }}
              >
                {Array.from({ length: CYCLES * list.length }, (_, i) => {
                  const idx = i % list.length;
                  const current = settled && idx === landed[r];
                  return (
                    <span className={`ds-cell${current ? ' is-current' : ''}`} key={i}>
                      {r === 2 && <Icon good={idx === GOOD} />}
                      {list[idx]}
                    </span>
                  );
                })}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <span className="ds-fade ds-fade--top" aria-hidden="true" />
      <span className="ds-fade ds-fade--bottom" aria-hidden="true" />

      <button
        type="button"
        className={`ds-lever${pulled ? ' is-pulled' : ''}`}
        onClick={pull}
        aria-label="Pull the lever to spin again"
        data-cursor=""
      >
        <img src={leverBall} alt="" className="ds-lever-ball" />
        <svg viewBox="0 0 40 24" width="26" height="16" aria-hidden="true"><path d="M3 4L20 20L36 3" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
        <svg viewBox="0 0 40 24" width="26" height="16" aria-hidden="true"><path d="M3 4L20 20L36 3" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
        <span className="ds-lever-stem" />
        <img src={leverBall} alt="" className="ds-lever-ball ds-lever-ball--sm" />
        <span className="ds-lever-label">Spin again</span>
      </button>

      <p className="ds-sr" aria-live="polite">
        {settled ? `${SECTORS[landed[0]]} × ${METHODS[landed[1]]} = ${RESULTS[landed[2]]}` : ''}
      </p>
    </section>
  );
};

export default DecisionSlot;
