import React, { useEffect, useRef, useState } from 'react';
import './DecisionJourney.css';

/* ------------------------------------------------------------------
   "From an uncertain decision to a defensible one."
   A scroll-driven story. A cloud of points (the uncertainty) sits in a
   sticky stage while the five steps scroll past, and reorganises itself
   for each one:
     0  chaos            — before the work starts
     1  Frame            — a frame is drawn, what is out of scope drifts off
     2  Evidence         — verified / inferred / unknown, as dot matrices
     3  Alternatives     — the points flow along four branches
     4  Recommend        — one branch wins, everything packs into a seal
     5  Accompany        — the seal becomes a flow along a timeline
   Scrolling back plays it in reverse. The points shy away from the pointer.
   ------------------------------------------------------------------ */

const STEPS = [
  {
    title: 'Frame',
    text: 'What is being decided, by whom, by when, and what a good outcome looks like — set down in a written scope before any work starts. Often the question first asked is not the one that matters.',
  },
  {
    title: 'Establish the evidence',
    text: 'Interviews at every level, operational and financial records, market analysis, independent checks on the assumptions behind the plan. Everything is filed as verified, inferred or unknown.',
  },
  {
    title: 'Model the alternatives',
    text: 'Every realistic course of action is modelled: expected outcome, downside, capital and organisational needs, and the exact conditions under which it would fail.',
  },
  {
    title: 'Recommend',
    text: 'A clear recommendation to the sponsoring body, with the alternatives weighed, the risks of each, and what would have to change for our advice to change.',
  },
  {
    title: 'Accompany',
    text: 'If you go ahead, we stay — through programme governance or our engineering division, under the same named accountability.',
  },
];

const IN_SCOPE = 0.55;                 // share of the cloud that survives the framing
const EVIDENCE = [0.45, 0.3, 0.25];    // verified / inferred / unknown
const BRANCHES = 4;
const CHOSEN = 1;                      // the branch that gets recommended
const COLS = 9;                        // dot-matrix width

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (x) => x * x * (3 - 2 * x);
const lerp = (a, b, k) => a + (b - a) * k;

// a point on the cubic bezier p0 → p3
const bezier = (p0, p1, p2, p3, u) => {
  const v = 1 - u;
  return {
    x: v * v * v * p0.x + 3 * v * v * u * p1.x + 3 * v * u * u * p2.x + u * u * u * p3.x,
    y: v * v * v * p0.y + 3 * v * v * u * p1.y + 3 * v * u * u * p2.y + u * u * u * p3.y,
  };
};

/* --------------------------- the particles -------------------------- */

const makeParticles = (count) => {
  const inScope = Math.round(count * IN_SCOPE);
  const cut = [EVIDENCE[0], EVIDENCE[0] + EVIDENCE[1]].map((f) => Math.round(inScope * f));
  const groupIndex = [0, 0, 0];
  return Array.from({ length: count }, (_, i) => {
    const scoped = i < inScope;
    const group = !scoped ? -1 : i < cut[0] ? 0 : i < cut[1] ? 1 : 2;
    const slot = group >= 0 ? groupIndex[group]++ : -1;
    return {
      i,
      scoped,
      group,
      slot,
      branch: i % BRANCHES,
      sx: Math.random(),
      sy: Math.random(),
      seed: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random(),
      r0: 1.5 + Math.random() * 1.9,
      shade: 0.05 + Math.random() * 0.6,
      ring: Math.random() < 0.3,
      lag: 0.05 + Math.random() * 0.09,
      x: 0,
      y: 0,
      placed: false,
    };
  });
};

/* geometry that depends on the canvas size */
const makeLayout = (W, H, particles) => {
  const scoped = particles.filter((p) => p.scoped).length;
  const groupSizes = [0, 1, 2].map((g) => particles.filter((p) => p.group === g).length);
  const frame = { x: W * 0.16, y: H * 0.14, w: W * 0.68, h: H * 0.7 };
  const gap = Math.max(18, W * 0.05);
  const cell = Math.min(15, (W * 0.84 - 2 * gap) / (3 * COLS));
  const blockW = cell * (COLS - 1);
  const startX = (W - (3 * blockW + 2 * gap)) / 2;
  const base = H * 0.7;
  const root = { x: W * 0.1, y: H * 0.52 };
  const ends = Array.from({ length: BRANCHES }, (_, b) => ({ x: W * 0.8, y: H * (0.16 + b * 0.2) }));
  const curves = ends.map((end) => [root, { x: W * 0.42, y: root.y }, { x: W * 0.5, y: end.y }, end]);
  const seal = { x: ends[CHOSEN].x, y: ends[CHOSEN].y, r: Math.min(W, H) * 0.1 };
  const line = { x0: W * 0.08, x1: W * 0.92, y: H * 0.6 };
  return { W, H, frame, cell, blockW, gap, startX, base, groupSizes, root, ends, curves, seal, line, scoped };
};

/* where particle p wants to be at a given stage (time t, seconds) */
const target = (stage, p, t, L) => {
  const wobble = (amp) => ({
    dx: Math.sin(t * p.speed + p.phase) * amp,
    dy: Math.cos(t * p.speed * 1.3 + p.phase) * amp,
  });

  if (stage === 0) {
    const w = wobble(14);
    return { x: L.W * (0.04 + 0.92 * p.sx) + w.dx, y: L.H * (0.06 + 0.88 * p.sy) + w.dy, r: p.r0, a: 0.35 + p.shade, g: p.shade, ring: p.ring ? 1 : 0 };
  }

  if (stage === 1) {
    const F = L.frame;
    if (p.scoped) {
      const w = wobble(5);
      return { x: F.x + 14 + (F.w - 28) * p.sx + w.dx, y: F.y + 14 + (F.h - 28) * p.sy + w.dy, r: p.r0, a: 0.9, g: p.shade * 0.6, ring: p.ring ? 1 : 0 };
    }
    // pushed out past the nearest edge of the frame
    const cx = L.W / 2;
    const cy = L.H / 2;
    const ang = Math.atan2(p.sy - 0.5, p.sx - 0.5);
    const reach = Math.max(L.W, L.H) * (0.46 + p.seed * 0.18);
    const w = wobble(8);
    return { x: cx + Math.cos(ang) * reach + w.dx, y: cy + Math.sin(ang) * reach * 0.8 + w.dy, r: p.r0 * 0.8, a: 0.16, g: 0.5, ring: 0 };
  }

  if (!p.scoped) {
    // out of scope: fades out where it was left
    const ang = Math.atan2(p.sy - 0.5, p.sx - 0.5);
    const reach = Math.max(L.W, L.H) * (0.5 + p.seed * 0.2);
    return { x: L.W / 2 + Math.cos(ang) * reach, y: L.H / 2 + Math.sin(ang) * reach * 0.8, r: 1, a: 0, g: 0.5, ring: 0 };
  }

  if (stage === 2) {
    const col = p.slot % COLS;
    const row = Math.floor(p.slot / COLS);
    const bx = L.startX + p.group * (L.blockW + L.gap);
    const look = [
      { g: 0, ring: 0, r: L.cell * 0.36 },
      { g: 0.55, ring: 0, r: L.cell * 0.32 },
      { g: 0.35, ring: 1, r: L.cell * 0.32 },
    ][p.group];
    return { x: bx + col * L.cell, y: L.base - row * L.cell, r: look.r, a: 1, g: look.g, ring: look.ring };
  }

  if (stage === 3) {
    const u = (p.seed + t * 0.07 * p.speed) % 1;
    const at = bezier(...L.curves[p.branch], u);
    const side = (p.sy - 0.5) * 7;
    return { x: at.x, y: at.y + side, r: 2, a: 0.25 + 0.75 * Math.sin(Math.PI * u), g: p.branch === CHOSEN ? 0 : 0.35, ring: 0 };
  }

  if (stage === 4) {
    // packed into a disc on the chosen branch's end (sunflower layout)
    const k = p.i;
    const n = L.scoped;
    const ang = k * 2.39996;
    const rad = L.seal.r * Math.sqrt((k + 0.5) / n);
    return { x: L.seal.x + Math.cos(ang) * rad, y: L.seal.y + Math.sin(ang) * rad, r: 2.3, a: 1, g: 0, ring: 0 };
  }

  // stage 5: carried along the timeline, in a loose band
  const u = (p.seed + t * 0.045 * (0.8 + p.speed * 0.4)) % 1;
  return {
    x: lerp(L.line.x0, L.line.x1, u),
    y: L.line.y + (p.sy - 0.5) * 16,
    r: 2.1,
    a: Math.min(1, Math.sin(Math.PI * u) * 1.6),
    g: 0.05 + u * 0.3,
    ring: 0,
  };
};

/* --------------------------- the overlays --------------------------- */

const drawOverlays = (ctx, L, w, t, v) => {
  const ink = (alpha) => `rgba(0, 0, 0, ${alpha})`;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 1 — the scope frame draws itself on the way in, then fades as a whole
  const frameDraw = v < 1 ? clamp(w[1] * 1.4) : 1;
  const frameOn = v < 1 ? frameDraw : clamp(w[1] + w[2] * 0.2);
  if (frameOn > 0.01) {
    const F = L.frame;
    const per = 2 * (F.w + F.h);
    ctx.strokeStyle = ink(0.85 * frameOn);
    ctx.lineWidth = 1.4;
    ctx.setLineDash([per * frameDraw, per]);
    ctx.strokeRect(F.x, F.y, F.w, F.h);
    ctx.setLineDash([]);
    const c = 14;
    ctx.lineWidth = 3;
    [[F.x, F.y, 1, 1], [F.x + F.w, F.y, -1, 1], [F.x, F.y + F.h, 1, -1], [F.x + F.w, F.y + F.h, -1, -1]]
      .forEach(([x, y, sx, sy]) => {
        ctx.beginPath();
        ctx.moveTo(x, y + sy * c);
        ctx.lineTo(x, y);
        ctx.lineTo(x + sx * c, y);
        ctx.stroke();
      });
  }

  // 2 — the three evidence piles are named
  if (w[2] > 0.01) {
    ctx.fillStyle = ink(0.75 * w[2]);
    ctx.font = '600 13px Fustat, Inter, sans-serif';
    ctx.textAlign = 'left';
    ['Verified', 'Inferred', 'Unknown'].forEach((label, g) => {
      const x = L.startX + g * (L.blockW + L.gap) - L.cell * 0.4;
      ctx.fillText(label, x, L.base + L.cell + 16);
    });
  }

  // 3 and 4 — the branches; at 4 only the chosen one stays solid
  const treeOn = clamp(w[3] + w[4]);
  if (treeOn > 0.01) {
    L.curves.forEach((curve, b) => {
      const chosen = b === CHOSEN;
      const alpha = treeOn * (chosen ? 0.55 + 0.45 * w[4] : 0.3 * (1 - 0.6 * w[4]));
      ctx.strokeStyle = ink(alpha);
      ctx.lineWidth = chosen ? 1.2 + 2.6 * w[4] : 1.1;
      ctx.setLineDash(!chosen && w[4] > 0.05 ? [4, 6] : []);
      ctx.beginPath();
      ctx.moveTo(curve[0].x, curve[0].y);
      ctx.bezierCurveTo(curve[1].x, curve[1].y, curve[2].x, curve[2].y, curve[3].x, curve[3].y);
      ctx.stroke();
      // a small cap at each outcome
      ctx.setLineDash([]);
      ctx.fillStyle = ink(alpha);
      ctx.beginPath();
      ctx.arc(curve[3].x, curve[3].y, chosen ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = ink(0.8 * treeOn);
    ctx.beginPath();
    ctx.arc(L.root.x, L.root.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5 — the delivery line with its milestones
  if (w[5] > 0.01) {
    const { x0, x1, y } = L.line;
    const len = (x1 - x0) * clamp(w[5] * 1.3);
    ctx.strokeStyle = ink(0.7 * w[5]);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x0 + len, y);
    ctx.stroke();
    // the accountable lead, out in front of the flow
    if (len >= x1 - x0 - 1) {
      const beat = 0.5 + 0.5 * Math.sin(t * 3);
      ctx.fillStyle = ink(0.9 * w[5]);
      ctx.beginPath();
      ctx.arc(x1, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = ink(0.35 * w[5] * (1 - beat));
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x1, y, 9 + beat * 14, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let k = 0; k <= 4; k += 1) {
      const x = lerp(x0, x1, k / 4);
      if (x > x0 + len) break;
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 - k * 0.9);
      ctx.strokeStyle = ink(0.7 * w[5]);
      ctx.beginPath();
      ctx.moveTo(x, y - 9);
      ctx.lineTo(x, y + 9);
      ctx.stroke();
      ctx.fillStyle = ink(0.08 * w[5] * pulse);
      ctx.beginPath();
      ctx.arc(x, y, 14 + pulse * 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

/* the check mark stamped on the seal, drawn in front of the points */
const drawSeal = (ctx, L, w4) => {
  if (w4 < 0.05) return;
  const { x, y, r } = L.seal;
  const draw = clamp((w4 - 0.35) / 0.65);
  if (draw <= 0) return;
  const pts = [[x - r * 0.42, y + r * 0.02], [x - r * 0.1, y + r * 0.32], [x + r * 0.46, y - r * 0.3]];
  const seg1 = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]);
  const seg2 = Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]);
  ctx.setLineDash([(seg1 + seg2) * draw, seg1 + seg2]);
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * w4})`;
  ctx.lineWidth = Math.max(3, r * 0.13);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  ctx.lineTo(pts[1][0], pts[1][1]);
  ctx.lineTo(pts[2][0], pts[2][1]);
  ctx.stroke();
  ctx.setLineDash([]);
  // a ring that widens once the stamp is complete
  ctx.strokeStyle = `rgba(0, 0, 0, ${0.5 * draw * w4})`;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x, y, r * (1.18 + 0.2 * draw), 0, Math.PI * 2);
  ctx.stroke();
};

/* ------------------------------ component --------------------------- */

const DecisionJourney = () => {
  const root = useRef(null);
  const canvas = useRef(null);
  const stepRefs = useRef([]);
  const [active, setActive] = useState(0);      // 0 = not started, 1..5 = step
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particles = makeParticles(window.innerWidth < 700 ? 220 : 320);
    let L = null;
    let raf = 0;
    let visible = false;
    let last = performance.now();
    let clock = 0;
    const pointer = { x: -9999, y: -9999 };
    let lastActive = -1;
    let lastResolved = null;

    const resize = () => {
      const box = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      el.width = Math.round(box.width * dpr);
      el.height = Math.round(box.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      L = makeLayout(box.width, box.height, particles);
    };

    // 0 before the first step reaches the reading line, k when step k is on
    // it, fractions in between. The reading line is the middle of the screen,
    // or — when the stage is pinned above the steps (phones) — the middle of
    // what is left visible under it.
    const stacked = window.matchMedia('(max-width: 900px)');
    const progress = () => {
      const below = stacked.matches ? el.parentElement.getBoundingClientRect().bottom : 0;
      const mid = (Math.max(0, below) + window.innerHeight) / 2;
      const centres = stepRefs.current.map((s) => {
        const r = s.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      if (mid <= centres[0]) return 1 - clamp((centres[0] - mid) / (window.innerHeight * 0.55));
      for (let k = 0; k < centres.length - 1; k += 1) {
        if (mid < centres[k + 1]) return k + 1 + (mid - centres[k]) / (centres[k + 1] - centres[k]);
      }
      return STEPS.length;
    };

    const frame = (now) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      if (!reduced) clock += dt;

      const v = clamp(progress(), 0, STEPS.length);
      const lo = Math.floor(v);
      const hi = Math.min(STEPS.length, lo + 1);
      const mix = smooth(clamp((v - lo - 0.12) / 0.76));
      const w = Array.from({ length: STEPS.length + 1 }, (_, k) => clamp(1 - Math.abs(v - k)));

      const step = v < 0.5 ? 0 : Math.min(STEPS.length, Math.round(v));
      if (step !== lastActive) { lastActive = step; setActive(step); }
      const isResolved = v >= 3.5;
      if (isResolved !== lastResolved) { lastResolved = isResolved; setResolved(isResolved); }
      root.current.style.setProperty('--dj-fill', clamp((v - 1) / (STEPS.length - 1)).toFixed(4));

      ctx.clearRect(0, 0, L.W, L.H);
      drawOverlays(ctx, L, w, clock, v);

      particles.forEach((p) => {
        const a = target(lo, p, clock, L);
        const b = target(hi, p, clock, L);
        const tx = lerp(a.x, b.x, mix);
        const ty = lerp(a.y, b.y, mix);
        if (!p.placed || reduced) {
          p.x = tx;
          p.y = ty;
          p.placed = true;
        } else {
          const k = 1 - Math.pow(1 - p.lag, dt * 60);   // frame-rate independent easing
          p.x += (tx - p.x) * k;
          p.y += (ty - p.y) * k;
        }
        const alpha = lerp(a.a, b.a, mix);
        if (alpha < 0.01) return;

        // shy of the pointer
        let x = p.x;
        let y = p.y;
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < 80 && d > 0.01) {
          const push = (1 - d / 80) ** 2 * 26;
          x += (dx / d) * push;
          y += (dy / d) * push;
        }

        const r = lerp(a.r, b.r, mix);
        const g = Math.round(lerp(a.g, b.g, mix) * 255);
        const ring = lerp(a.ring, b.ring, mix);
        ctx.globalAlpha = Math.min(1, alpha);
        if (ring > 0.5) {
          ctx.strokeStyle = `rgb(${g}, ${g}, ${g})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgb(${g}, ${g}, ${g})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
      drawSeal(ctx, L, w[4]);

      if (visible) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && visible) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    resize();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { resize(); start(); }) : null;
    if (ro) ro.observe(el);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    }, { rootMargin: '120px 0px' });
    io.observe(root.current);

    const onPointer = (e) => {
      const box = el.getBoundingClientRect();
      pointer.x = e.clientX - box.left;
      pointer.y = e.clientY - box.top;
    };
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };
    el.addEventListener('pointermove', onPointer);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      io.disconnect();
      if (ro) ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onPointer);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section
      className={`dj${resolved ? ' is-resolved' : ''}`}
      ref={root}
      data-fx-skip=""
      aria-labelledby="dj-title"
    >
      <div className="dj-body">
        <div className="dj-stage">
          <h2 className="dj-title" id="dj-title">
            From an{' '}
            <span className="dj-uncertain">
              {'uncertain'.split('').map((ch, i) => (
                <span key={i} style={{ '--i': i }} aria-hidden="true">{ch}</span>
              ))}
              <span className="dj-sr">uncertain</span>
            </span>{' '}
            decision
            <br />
            to a{' '}
            <span className="dj-defensible">
              <span className="dj-defensible-outline u-outline-dark" aria-hidden="true">defensible</span>
              <span className="dj-defensible-fill">defensible</span>
            </span>{' '}
            one.
          </h2>
          <canvas ref={canvas} className="dj-canvas" aria-hidden="true" />
        </div>

        <ol className="dj-steps">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              ref={(node) => { stepRefs.current[i] = node; }}
              className={`dj-step${active === i + 1 ? ' is-active' : ''}${active > i + 1 ? ' is-past' : ''}`}
            >
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default DecisionJourney;
