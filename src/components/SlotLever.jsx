import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

/* ------------------------------------------------------------------
   The slot machine's arm, drawn front-on.
   The arm swings towards the viewer around the hub, so it is projected
   with a little perspective: the knob travels down the track and grows
   as it comes closer, the rod foreshortens behind it. Letting go hands
   the arm to a damped spring, which carries it back up, lets it hit the
   top stop and settle.
   It can be clicked (the pull plays by itself) or dragged by hand.
   ------------------------------------------------------------------ */

const DEG = Math.PI / 180;
const VIEW_H = 290;                   // viewBox height, for pointer → drawing units
const HUB = { x: 50, y: 170 };
const ARM = 118;                      // rod length
const CAMERA = 460;                   // viewer distance: smaller = stronger perspective
const REST = 34 * DEG;                // idle lean, towards the viewer
const MAX = 126 * DEG;                // bottom of the travel
const STOP = 20 * DEG;                // top stop the spring bounces off
const FIRE = REST + (MAX - REST) * 0.6; // dragged past this → the pull counts

const PULL_MS = 330;
const HOLD_MS = 110;
const SPRING = 120;                   // stiffness
const DAMPING = 9.5;                  // under-damped: it overshoots, taps the stop, settles
const RATCHET = 9 * DEG;              // one click per step of travel

const project = (angle) => {
  const depth = ARM * Math.sin(angle);
  const scale = CAMERA / (CAMERA - depth);
  return { y: HUB.y - ARM * Math.cos(angle) * scale, scale };
};

// knob height → angle, for dragging (monotonic between REST and MAX)
const angleAt = (y) => {
  let lo = REST;
  let hi = MAX;
  for (let i = 0; i < 22; i += 1) {
    const mid = (lo + hi) / 2;
    if (project(mid).y < y) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
};

const SlotLever = forwardRef(({ onPull, locked, sound }, ref) => {
  const button = useRef(null);
  const rod = useRef(null);
  const knob = useRef(null);
  const glow = useRef(null);
  const state = useRef({
    angle: REST, speed: 0, mode: 'rest', raf: 0, last: 0, start: 0, from: REST,
    fired: false, notch: 0, drag: null,
  });
  // latest props, for the animation loop and the pointer handlers
  const live = useRef({ onPull, locked, sound });
  useEffect(() => { live.current = { onPull, locked, sound }; });

  const draw = () => {
    const { angle } = state.current;
    const { y, scale } = project(angle);
    const w0 = 5.5;
    const w1 = 5.5 * scale;
    rod.current.setAttribute(
      'points',
      `${HUB.x - w0},${HUB.y} ${HUB.x + w0},${HUB.y} ${HUB.x + w1},${y} ${HUB.x - w1},${y}`
    );
    knob.current.setAttribute('transform', `translate(${HUB.x} ${y.toFixed(2)}) scale(${scale.toFixed(4)})`);
    // the slot lights up under the knob as it travels
    glow.current.setAttribute('cy', Math.min(246, Math.max(112, y)).toFixed(2));
  };

  const ratchet = () => {
    const s = state.current;
    const notch = Math.floor(s.angle / RATCHET);
    if (notch > s.notch) live.current.sound?.ratchet();
    s.notch = notch;
  };

  const fire = () => {
    const s = state.current;
    if (s.fired) return;
    s.fired = true;
    live.current.sound?.clunk();
    live.current.onPull?.();
  };

  const loop = (now) => {
    const s = state.current;
    s.raf = 0;
    const dt = Math.min(0.034, Math.max(0, (now - s.last) / 1000));   // never backwards
    s.last = now;

    if (s.mode === 'pull') {
      // the frame timestamp can predate the click that started the pull
      const t = Math.min(1, Math.max(0, (now - s.start) / PULL_MS));
      s.angle = s.from + (MAX - s.from) * t ** 1.7;   // a hand: slow start, hard finish
      ratchet();
      if (t >= 1) {
        fire();
        s.mode = 'hold';
        s.start = now;
      }
    } else if (s.mode === 'hold') {
      if (now - s.start >= HOLD_MS) { s.mode = 'spring'; s.speed = 0; }
    } else if (s.mode === 'spring') {
      // semi-implicit Euler in small steps keeps the spring stable
      const steps = Math.max(1, Math.ceil(dt / 0.004));
      const h = dt / steps;
      for (let i = 0; i < steps; i += 1) {
        s.speed += (-SPRING * (s.angle - REST) - DAMPING * s.speed) * h;
        s.angle += s.speed * h;
        if (s.angle < STOP) {
          s.angle = STOP;
          if (s.speed < -0.6) live.current.sound?.clack();
          s.speed *= -0.32;
        }
      }
      s.notch = Math.floor(s.angle / RATCHET);
      if (Math.abs(s.angle - REST) < 0.0015 && Math.abs(s.speed) < 0.02) {
        s.angle = REST;
        s.speed = 0;
        s.mode = 'rest';
      }
    }

    draw();
    if (s.mode !== 'rest' && s.mode !== 'drag') s.raf = requestAnimationFrame(loop);
  };

  const run = () => {
    const s = state.current;
    if (s.raf) return;
    s.last = performance.now();
    s.raf = requestAnimationFrame(loop);
  };

  const autoPull = () => {
    const s = state.current;
    if (s.mode === 'pull' || s.mode === 'hold' || s.mode === 'drag') return;
    s.mode = 'pull';
    s.from = s.angle;
    s.start = performance.now();
    s.fired = false;
    run();
  };

  // a locked machine answers with a small shrug instead of a pull
  const refuse = () => {
    const s = state.current;
    if (s.mode !== 'rest') return;
    s.speed = 2.4;
    s.mode = 'spring';
    run();
  };

  useImperativeHandle(ref, () => ({ pull: autoPull }));

  useEffect(() => {
    draw();
    const s = state.current;

    // an idle arm twitches now and then, so it reads as something to pull
    const nudge = window.setInterval(() => {
      if (s.mode !== 'rest' || live.current.locked || document.hidden) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const box = button.current.getBoundingClientRect();
      if (box.height === 0 || box.bottom < 0 || box.top > window.innerHeight) return;
      s.speed = 1.9;
      s.mode = 'spring';
      run();
    }, 5200);

    return () => {
      window.clearInterval(nudge);
      if (s.raf) cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e) => {
    live.current.sound?.unlock();
    const s = state.current;
    if (e.button > 0 || s.mode === 'pull' || s.mode === 'hold') return;
    if (live.current.locked) { refuse(); return; }
    button.current.setPointerCapture(e.pointerId);
    if (s.raf) { cancelAnimationFrame(s.raf); s.raf = 0; }
    s.mode = 'drag';
    s.fired = false;
    s.drag = {
      id: e.pointerId,
      y0: e.clientY,
      knob0: project(Math.max(REST, s.angle)).y,
      unit: VIEW_H / button.current.getBoundingClientRect().height,
      moved: false,
    };
  };

  const onPointerMove = (e) => {
    const s = state.current;
    if (s.mode !== 'drag' || !s.drag || e.pointerId !== s.drag.id) return;
    const dy = (e.clientY - s.drag.y0) * s.drag.unit;
    if (Math.abs(dy) > 4) s.drag.moved = true;
    s.angle = angleAt(s.drag.knob0 + dy);
    ratchet();
    if (s.angle > MAX - 0.02) fire();   // dragged all the way down
    draw();
  };

  const onPointerUp = (e) => {
    const s = state.current;
    if (s.mode !== 'drag' || !s.drag || e.pointerId !== s.drag.id) return;
    const { moved } = s.drag;
    s.drag = null;
    if (!moved) {            // a plain click: play the whole pull
      s.mode = 'rest';
      autoPull();
      return;
    }
    if (s.angle >= FIRE) fire();
    s.speed = 0;
    s.mode = 'spring';
    run();
  };

  const onKeyDown = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    live.current.sound?.unlock();
    if (live.current.locked) refuse();
    else autoPull();
  };

  return (
    <button
      type="button"
      ref={button}
      className={`ds-lever${locked ? ' is-locked' : ''}`}
      aria-label="Pull the lever to spin again"
      data-cursor=""
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <svg viewBox="0 0 100 290" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="ds-plate" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbfbfb" />
            <stop offset="1" stopColor="#cfcfcf" />
          </linearGradient>
          <linearGradient id="ds-rod" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8d8d8d" />
            <stop offset="0.28" stopColor="#fafafa" />
            <stop offset="0.55" stopColor="#c4c4c4" />
            <stop offset="1" stopColor="#6f6f6f" />
          </linearGradient>
          <radialGradient id="ds-hub" cx="0.38" cy="0.32" r="0.8">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#c9c9c9" />
            <stop offset="1" stopColor="#7c7c7c" />
          </radialGradient>
          <radialGradient id="ds-knob" cx="0.36" cy="0.3" r="0.82">
            <stop offset="0" stopColor="#6a6a6a" />
            <stop offset="0.38" stopColor="#1f1f1f" />
            <stop offset="1" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="ds-slot-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <clipPath id="ds-slot-clip">
            <rect x="44" y="110" width="12" height="138" rx="6" />
          </clipPath>
        </defs>

        {/* housing plate with the travel slot */}
        <rect x="27" y="94" width="46" height="170" rx="23" fill="url(#ds-plate)" stroke="#b9b9b9" strokeWidth="1" />
        <rect x="44" y="110" width="12" height="138" rx="6" fill="#0d0d0d" />
        <g clipPath="url(#ds-slot-clip)">
          <ellipse ref={glow} cx="50" cy="112" rx="14" ry="20" fill="url(#ds-slot-glow)" />
        </g>
        <circle cx="50" cy="102" r="1.6" fill="#9a9a9a" />
        <circle cx="50" cy="256" r="1.6" fill="#9a9a9a" />

        {/* hub the arm pivots on */}
        <circle cx={HUB.x} cy={HUB.y} r="13" fill="url(#ds-hub)" stroke="#6c6c6c" strokeWidth="0.8" />
        <circle cx={HUB.x} cy={HUB.y} r="4.6" fill="#2a2a2a" />

        <polygon ref={rod} fill="url(#ds-rod)" stroke="#5e5e5e" strokeWidth="0.6" strokeLinejoin="round" />

        <g ref={knob} className="ds-lever-knob">
          <circle r="17" fill="url(#ds-knob)" />
          <ellipse cx="-5.6" cy="-7" rx="5.4" ry="3.4" fill="#ffffff" opacity="0.55" transform="rotate(-28 -5.6 -7)" />
          <circle r="16.4" fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1.2" />
        </g>
      </svg>
      <span className="ds-lever-label">Spin again</span>
    </button>
  );
});

SlotLever.displayName = 'SlotLever';

export default SlotLever;
