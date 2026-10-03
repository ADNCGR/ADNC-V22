import React, { useEffect, useRef, useState } from 'react';
import SlotLever from './SlotLever';
import { createSlotSound } from './slotSound';
import './DecisionSlot.css';

/* ------------------------------------------------------------------
   The consulting equation as a slot machine:
       sector  ×  method  =  outcome
   The sector never changes the outcome — only the method does. A sound
   method pays out one of the good outcomes, anything else one of the
   bad ones.
   ------------------------------------------------------------------ */

const SECTORS = [
  'Public Authority', 'Restaurant Group', 'Hospital Network', 'Logistics Operator',
  'Retail Chain', 'Energy Utility', 'Regional Bank', 'Insurance Carrier',
  'Telecom Operator', 'University', 'Port Authority', 'Family Business',
  'Hotel Group', 'Manufacturer', 'Ministry', 'Scale-up',
].map((text) => ({ text }));

const METHODS = [
  { text: 'Fixed Data Methodology', good: true },
  { text: 'Assumption' },
  { text: 'Scenario Modelling', good: true },
  { text: 'Gut Feeling / Intuition' },
  { text: 'Sensitivity Analysis', good: true },
  { text: 'Market Hype' },
  { text: 'Sourced Evidence', good: true },
  { text: 'The Loudest Voice' },
  { text: 'Risk Quantification', good: true },
  { text: 'Sunk Cost' },
  { text: 'Decision Structuring', good: true },
  { text: 'Copying a Competitor' },
  { text: 'Wishful Thinking' },
  { text: "A Vendor's Pitch" },
];

const RESULTS = [
  { text: 'Proven Decision', good: true },
  { text: 'Untested Bet' },
  { text: 'Defensible Call', good: true },
  { text: 'Costly Guess' },
  { text: 'Board Approved', good: true },
  { text: 'Expensive Detour' },
  { text: 'Risk Understood', good: true },
  { text: 'Stalled Programme' },
  { text: 'Budget Protected', good: true },
  { text: 'Budget Overrun' },
  { text: 'Clear Go / No-Go', good: true },
  { text: 'Square One Again' },
  { text: 'Public U-Turn' },
];

const REELS = [SECTORS, METHODS, RESULTS];
const REEL_NAMES = ['sector', 'method', 'result'];

const SLOTS = [-3, -2, -1, 0, 1, 2];   // rows kept in the DOM around the pay-line
const TRAVEL = [13, 21, 29];           // rows each reel runs at least before stopping
const DURATION = [1250, 1850, 2450];   // ms — reels stop left to right
const SETTLE = 280;                    // ms of bounce once a reel reaches its stop
const OVERSHOOT = 0.26;                // rows it runs past before springing back

const CHECK = '<svg viewBox="0 0 23 18" width="22" height="17" aria-hidden="true"><path d="M7.26 17.84L0 10.58L3.16 7.58L7.26 11.69L18.95 0L22.11 3.16L7.26 17.84Z" fill="currentColor"/></svg>';
const CROSS = '<svg viewBox="0 0 18 18" width="17" height="17" aria-hidden="true"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" fill="none"/></svg>';

const mod = (n, m) => ((n % m) + m) % m;
const rand = (n) => Math.floor(Math.random() * n);
const pickWhere = (list, test, except) => {
  const pool = list.map((item, i) => i).filter((i) => test(list[i]) && i !== except);
  return pool[rand(pool.length)];
};

// position of a reel `t` ms into its run: a long slow-down, then a bounce
const reelAt = (run, t) => {
  const glide = run.duration - SETTLE;
  if (t <= glide) {
    const x = t / glide;
    return run.from + (run.to + OVERSHOOT - run.from) * (1 - (1 - x ** 1.2) ** 2.6);
  }
  const u = Math.min(1, (t - glide) / SETTLE);
  return run.to + OVERSHOOT * (1 - u) ** 2 * Math.cos(u * Math.PI * 1.5);
};

const SOUND_KEY = 'adnc-slot-sound';
const readSound = () => {
  try {
    return window.localStorage.getItem(SOUND_KEY) !== 'off';
  } catch {
    return true;
  }
};

const DecisionSlot = () => {
  const root = useRef(null);
  const fx = useRef(null);
  const lever = useRef(null);
  const strips = useRef([]);
  const machine = useRef(null);   // imperative state, set up once in the effect below
  const [sound] = useState(createSlotSound);   // one synth for the life of the machine

  const [phase, setPhase] = useState('good');        // spinning | good | bad
  const [landed, setLanded] = useState([0, 0, 0]);
  const [soundOn, setSoundOn] = useState(readSound);

  useEffect(() => {
    sound.setEnabled(soundOn);
    try {
      window.localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off');
    } catch {
      /* storage disabled — the choice just lasts for this visit */
    }
  }, [sound, soundOn]);

  useEffect(() => {
    const audio = sound;
    const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers = [];
    const later = (fn, ms) => timers.push(window.setTimeout(fn, ms));

    const html = REELS.map((list, r) => list.map((item) => (
      r === 2 ? `${item.good ? CHECK : CROSS}<span>${item.text}</span>` : `<span>${item.text}</span>`
    )));
    const cells = strips.current.map((strip) => Array.from(strip.children));
    const m = {
      pos: [0, 0, 0], runs: null, raf: 0, started: 0, busy: false,
      last: [0, 0, 0], lastTick: [0, 0, 0], stopped: [true, true, true],
      landed: [0, 0, 0], intro: 0, forced: null, lastFrame: 0,
    };
    machine.current = m;

    // lay one reel out around its current position
    const render = (r) => {
      const len = REELS[r].length;
      const base = Math.floor(m.pos[r]);
      const frac = m.pos[r] - base;
      cells[r].forEach((cell, k) => {
        const index = mod(base - SLOTS[k], len);
        if (cell.dataset.index !== String(index)) {
          cell.dataset.index = index;
          cell.innerHTML = html[r][index];
          cell.classList.remove('is-current');
        }
        cell.style.transform = `translateY(calc(${(SLOTS[k] + frac - 0.5).toFixed(4)} * var(--rowh)))`;
      });
    };

    const markCurrent = (on) => {
      cells.forEach((reel, r) => reel.forEach((cell, k) => {
        cell.classList.toggle('is-current', on && SLOTS[k] === 0 && m.stopped[r]);
      }));
    };

    /* ---- outcome effects -------------------------------------------- */

    const burst = (good) => {
      const host = fx.current;
      const from = root.current.querySelector('.ds-reel--result').getBoundingClientRect();
      const box = root.current.getBoundingClientRect();
      const cx = from.left - box.left + from.width / 2;
      const cy = from.top - box.top + from.height / 2;
      const count = good ? 34 : 11;
      for (let i = 0; i < count; i += 1) {
        const bit = document.createElement('span');
        bit.className = `ds-bit ds-bit--${good ? ['square', 'dot', 'ring', 'stick'][i % 4] : 'crumb'}`;
        host.appendChild(bit);
        let frames;
        let duration;
        if (good) {
          // confetti: thrown up and outwards, then it falls
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.5;
          const reach = 70 + Math.random() * 150;
          const dx = Math.cos(angle) * reach;
          const up = Math.sin(angle) * reach;
          const spin = (Math.random() - 0.5) * 900;
          duration = 1100 + Math.random() * 700;
          frames = [
            { transform: `translate(${cx}px, ${cy}px) rotate(0deg) scale(0.4)`, opacity: 1, easing: 'cubic-bezier(0.15, 0.7, 0.3, 1)' },
            { transform: `translate(${cx + dx * 0.75}px, ${cy + up}px) rotate(${spin * 0.5}deg) scale(1)`, opacity: 1, offset: 0.38, easing: 'cubic-bezier(0.5, 0, 0.9, 0.6)' },
            { transform: `translate(${cx + dx}px, ${cy + up + 170 + Math.random() * 90}px) rotate(${spin}deg) scale(0.9)`, opacity: 0 },
          ];
        } else {
          // crumbs: they simply drop off the bottom of the window
          const x = cx + (Math.random() - 0.5) * from.width * 0.7;
          const y = cy + 14;
          duration = 650 + Math.random() * 450;
          frames = [
            { transform: `translate(${x}px, ${y}px) rotate(0deg)`, opacity: 0.9, easing: 'cubic-bezier(0.5, 0, 1, 0.7)' },
            { transform: `translate(${x + (Math.random() - 0.5) * 26}px, ${y + 70 + Math.random() * 60}px) rotate(${(Math.random() - 0.5) * 240}deg)`, opacity: 0 },
          ];
        }
        const anim = bit.animate(frames, { duration, delay: good ? rand(90) : 120 + rand(260), fill: 'both' });
        anim.onfinish = () => bit.remove();
        anim.oncancel = () => bit.remove();
      }
    };

    const land = () => {
      m.busy = false;
      m.landed = m.runs.map((run, r) => mod(run.to, REELS[r].length));
      const good = Boolean(METHODS[m.landed[1]].good);
      markCurrent(true);
      setLanded(m.landed);
      setPhase(good ? 'good' : 'bad');
      if (good) audio.win(); else audio.lose();
      if (!reduced()) burst(good);

      // first visit: one losing spin, then the winning one, hands-free
      if (m.intro === 1) {
        m.intro = 2;
        later(() => { m.forced = 'win'; lever.current?.pull(); }, 1900);
      }
    };

    /* ---- spinning ---------------------------------------------------- */

    const frame = (now) => {
      m.raf = 0;
      const t = Math.max(0, now - m.started);   // a frame can start before the spin did
      const dt = Math.max(1, now - m.lastFrame);
      m.lastFrame = now;
      let running = false;

      m.runs.forEach((run, r) => {
        if (m.stopped[r]) return;
        const before = m.pos[r];
        m.pos[r] = reelAt(run, Math.min(t, run.duration));
        render(r);

        const row = Math.floor(m.pos[r]);
        if (row !== m.last[r] && t < run.duration - SETTLE) {
          m.last[r] = row;
          if (now - m.lastTick[r] > 32) { m.lastTick[r] = now; audio.tick(r); }
        }
        if (!run.thunked && t >= run.duration - SETTLE) { run.thunked = true; audio.thunk(r); }

        // motion blur follows the speed (rows per second)
        const speed = Math.abs(m.pos[r] - before) / (dt / 1000);
        const blur = Math.min(2.4, speed / 13);
        strips.current[r].style.filter = blur > 0.25 ? `blur(${blur.toFixed(1)}px)` : '';

        if (t >= run.duration) {
          m.pos[r] = run.to;
          m.stopped[r] = true;
          strips.current[r].style.filter = '';
          render(r);
          markCurrent(true);
        } else {
          running = true;
        }
      });

      if (running) m.raf = requestAnimationFrame(frame);
      else land();
    };

    const spin = () => {
      if (m.busy) return;
      m.busy = true;

      // after a win the next pull usually loses; after a loss it usually wins
      const wasGood = Boolean(METHODS[m.landed[1]].good);
      let good = Math.random() < (wasGood ? 0.35 : 0.62);
      if (m.forced) good = m.forced === 'win';
      const method = m.forced === 'win'
        ? 0
        : pickWhere(METHODS, (x) => Boolean(x.good) === good, m.landed[1]);
      const result = m.forced === 'win'
        ? 0
        : pickWhere(RESULTS, (x) => Boolean(x.good) === good, m.landed[2]);
      const sector = pickWhere(SECTORS, () => true, m.landed[0]);
      m.forced = null;

      const targets = [sector, method, result];
      m.runs = targets.map((target, r) => {
        const len = REELS[r].length;
        const from = mod(Math.round(m.pos[r]), len);
        const to = from + TRAVEL[r] + mod(target - (from + TRAVEL[r]), len);
        m.pos[r] = from;
        m.last[r] = from;
        return { from, to, duration: DURATION[r], thunked: false };
      });
      m.stopped = [false, false, false];
      markCurrent(false);
      setPhase('spinning');

      if (reduced()) {
        m.runs.forEach((run, r) => { m.pos[r] = run.to; m.stopped[r] = true; render(r); });
        land();
        return;
      }
      m.started = performance.now();
      m.lastFrame = m.started;
      m.raf = requestAnimationFrame(frame);
    };
    m.spin = spin;

    [0, 1, 2].forEach(render);
    markCurrent(true);

    // audio may only start after a gesture somewhere on the page
    const unlock = () => audio.unlock();
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock);

    let io;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || m.intro) return;
        io.disconnect();
        m.intro = 1;
        m.forced = 'lose';
        lever.current?.pull();
      }, { threshold: 0.6 });
      io.observe(root.current);
    }

    return () => {
      if (io) io.disconnect();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      timers.forEach((id) => window.clearTimeout(id));
      if (m.raf) cancelAnimationFrame(m.raf);
      m.busy = true;      // a late lever callback must not restart a dead machine
    };
  }, [sound]);

  const settled = phase !== 'spinning';

  return (
    <section className="ds" ref={root} data-phase={phase} aria-label="Our method at a glance">
      <span className="ds-band" aria-hidden="true" />

      <div className="ds-machine" aria-hidden="true">
        {REELS.map((list, r) => (
          <React.Fragment key={REEL_NAMES[r]}>
            {r > 0 && <span className="ds-op">{r === 1 ? '×' : '='}</span>}
            <div className={`ds-reel ds-reel--${REEL_NAMES[r]}`}>
              {r !== 1 && <span className="ds-window" />}
              <div className="ds-strip" ref={(el) => { strips.current[r] = el; }}>
                {SLOTS.map((slot) => <span className="ds-cell" key={slot} />)}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <span className="ds-fade ds-fade--top" aria-hidden="true" />
      <span className="ds-fade ds-fade--bottom" aria-hidden="true" />
      <div className="ds-fx" ref={fx} aria-hidden="true" />

      <SlotLever
        ref={lever}
        locked={!settled}
        sound={sound}
        onPull={() => machine.current?.spin()}
      />

      <button
        type="button"
        className="ds-sound"
        aria-pressed={soundOn}
        aria-label={soundOn ? 'Turn the machine sound off' : 'Turn the machine sound on'}
        title={soundOn ? 'Sound on' : 'Sound off'}
        onClick={() => setSoundOn((on) => !on)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M4 9.5h3.2L12 5.6v12.8l-4.8-3.9H4z" fill="currentColor" />
          {soundOn ? (
            <path d="M15.2 9.2a4 4 0 0 1 0 5.6M17.6 6.8a7.4 7.4 0 0 1 0 10.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          ) : (
            <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          )}
        </svg>
      </button>

      <p className="ds-sr" aria-live="polite">
        {settled ? `${SECTORS[landed[0]].text} × ${METHODS[landed[1]].text} = ${RESULTS[landed[2]].text}` : ''}
      </p>
    </section>
  );
};

export default DecisionSlot;
