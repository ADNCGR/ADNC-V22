import React, { useEffect, useRef, useState } from 'react';
import './OddsBoard.css';

/* ------------------------------------------------------------------
   "Confidence, stated plainly" — a Galton board.
   Balls drop through rows of pegs and pile up into a distribution.
   How tightly they pile is the confidence level:
     Proven    — pulled back to the centre at every peg: a sharp spike
     Probable  — barely steered: the natural bell
     Unproven  — pushed outwards, with the odd wild bounce: a wide smear
   The three words in the copy pick the level; left alone, the board
   cycles through them.
   ------------------------------------------------------------------ */

const LEVELS = [
  { key: 'proven', word: 'Proven', text: 'means we tested it ourselves and it held.', pull: 0.45, wild: 0 },
  { key: 'probable', word: 'Probable', text: 'means the evidence points one way but has not been run end to end.', pull: 0.1, wild: 0 },
  { key: 'unproven', word: 'Unproven', text: 'means we genuinely do not know yet.', pull: -0.24, wild: 0.15 },
];

const ROWS = 12;
const BINS = ROWS + 1;
const CYCLE_MS = 8000;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const OddsBoard = ({ level, onLevel, auto }) => {
  const canvas = useRef(null);
  const live = useRef({ level, auto, onLevel });
  useEffect(() => { live.current = { level, auto, onLevel }; });

  useEffect(() => {
    const el = canvas.current;
    const ctx = el.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0;
    let H = 0;
    let G = null;
    let raf = 0;
    let visible = false;
    let last = performance.now();
    let spawnDebt = 0;
    let cycleAt = performance.now() + CYCLE_MS;
    let shownLevel = live.current.level;
    const balls = [];
    let piles = new Array(BINS).fill(0);
    let draining = null;            // { piles, t } while the old piles fall away

    const geometry = () => {
      const box = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = box.width;
      H = box.height;
      el.width = Math.round(W * dpr);
      el.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bw = (W * 0.9) / BINS;
      const top = H * 0.09;
      const gy = (H * 0.46) / ROWS;
      G = {
        cx: W / 2,
        bw,
        top,
        gy,
        pegY: (r) => top + r * gy,
        pegX: (r, k) => W / 2 + (k - r / 2) * bw,
        floor: H - 6,
        binTop: top + ROWS * gy + gy * 0.6,
        dot: Math.max(3, Math.min(6, bw * 0.24)),
      };
      // tallest pile that still fits under the pegs; reaching it drains the board
      G.cap = Math.max(8, Math.floor((G.floor - G.binTop) / (G.dot * 1.02)) - 1);
    };

    // the path one ball will take: a bin index per row
    const route = () => {
      const lvl = LEVELS.find((l) => l.key === live.current.level) || LEVELS[1];
      const steps = [0];
      let k = 0;
      for (let r = 0; r < ROWS; r += 1) {
        const offset = k - r / 2;                        // left of centre < 0 < right
        let pRight = 0.5 - lvl.pull * Math.sign(offset) * Math.min(1, Math.abs(offset) / 1.5);
        if (offset === 0) pRight = 0.5;
        let step = Math.random() < pRight ? 1 : 0;
        if (lvl.wild && Math.random() < lvl.wild) step = Math.random() < 0.5 ? 0 : 1; // a wild bounce
        k += step;
        if (lvl.wild && Math.random() < lvl.wild * 0.5 && r < ROWS - 1) {
          k = clamp(k + (Math.random() < 0.5 ? -1 : 1), 0, r + 1);
        }
        steps.push(k);
      }
      return steps;
    };

    const spawn = () => {
      balls.push({
        steps: route(),
        row: -1,                    // -1: still dropping from the hopper
        t: 0,
        seg: 0.07 + Math.random() * 0.03,
        jitter: (Math.random() - 0.5) * 6,
        x: G.cx,
        y: G.top - 40,
        vy: 0,
        falling: false,
      });
    };

    const drain = () => {
      draining = { piles: piles.slice(), t: 0 };
      piles = new Array(BINS).fill(0);
      balls.length = 0;
    };

    const update = (dt) => {
      const lvl = live.current.level;
      if (lvl !== shownLevel) { shownLevel = lvl; drain(); cycleAt = performance.now() + CYCLE_MS; }

      if (live.current.auto && performance.now() > cycleAt) {
        const i = LEVELS.findIndex((l) => l.key === lvl);
        live.current.onLevel(LEVELS[(i + 1) % LEVELS.length].key, true);
        cycleAt = performance.now() + CYCLE_MS;
      }

      spawnDebt += dt * 16;   // balls per second
      while (spawnDebt >= 1 && balls.length < 140) { spawn(); spawnDebt -= 1; }

      for (let i = balls.length - 1; i >= 0; i -= 1) {
        const b = balls[i];
        if (b.falling) {
          // into the bin, under gravity, onto the pile
          b.vy += 2400 * dt;
          b.y += b.vy * dt;
          const bin = b.steps[ROWS];
          const rest = G.floor - piles[bin] * G.dot * 1.02 - G.dot / 2;
          if (b.y >= rest) {
            piles[bin] += 1;
            balls.splice(i, 1);
            if (piles[bin] >= G.cap) drain();
          }
          continue;
        }
        b.t += dt / b.seg;
        if (b.t < 1) continue;
        b.t -= 1;
        b.row += 1;
        if (b.row >= ROWS) {
          b.falling = true;
          b.x = G.pegX(ROWS, b.steps[ROWS]);
          b.y = G.pegY(ROWS);
          b.vy = 120;
        }
      }
      if (draining) {
        draining.t += dt;
        if (draining.t > 0.9) draining = null;
      }
    };

    // where a ball between pegs is drawn: a small hop off each peg
    const ballPos = (b) => {
      if (b.falling) return { x: b.x, y: b.y };
      if (b.row < 0) {
        const y = (G.top - 40) + (G.pegY(0) - G.top + 40) * b.t * b.t;
        return { x: G.cx + b.jitter * (1 - b.t), y };
      }
      const k0 = b.steps[b.row];
      const k1 = b.steps[b.row + 1];
      const x0 = G.pegX(b.row, k0);
      const x1 = G.pegX(b.row + 1, k1);
      const y0 = G.pegY(b.row);
      const y1 = G.pegY(b.row + 1);
      const t = b.t;
      return {
        x: x0 + (x1 - x0) * t,
        y: y0 + (y1 - y0) * t ** 1.6 - Math.sin(Math.PI * t) * G.gy * 0.35,
      };
    };

    const drawPiles = (counts, fall, alpha) => {
      const d = G.dot;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.92 * alpha})`;
      counts.forEach((n, bin) => {
        const x = G.pegX(ROWS, bin);
        for (let j = 0; j < n; j += 1) {
          const y = G.floor - j * d * 1.02 - d / 2 + fall;
          ctx.beginPath();
          ctx.arc(x, y, d / 2 - 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // pegs
      ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
      for (let r = 0; r < ROWS; r += 1) {
        for (let k = 0; k <= r; k += 1) {
          ctx.beginPath();
          ctx.arc(G.pegX(r, k), G.pegY(r), 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // bin walls
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let k = 0; k <= BINS; k += 1) {
        const x = G.pegX(ROWS, k) - G.bw / 2;
        ctx.beginPath();
        ctx.moveTo(x, G.binTop);
        ctx.lineTo(x, G.floor);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(G.pegX(ROWS, 0) - G.bw / 2, G.floor + 1);
      ctx.lineTo(G.pegX(ROWS, ROWS) + G.bw / 2, G.floor + 1);
      ctx.stroke();

      // the old piles dropping away after a change of level
      if (draining) {
        const k = draining.t / 0.9;
        drawPiles(draining.piles, k * k * 220, 1 - k);
      }
      drawPiles(piles, 0, 1);

      // the shape the piles are taking
      const peak = Math.max(...piles);
      if (peak > 3) {
        const pts = piles.map((n, bin) => ({ x: G.pegX(ROWS, bin), y: G.floor - n * G.dot * 1.02 - 10 }));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i += 1) {
          const mx = (pts[i].x + pts[i + 1].x) / 2;
          const my = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.stroke();
      }

      // balls in flight, with a short trail
      balls.forEach((b) => {
        const p = ballPos(b);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, G.dot / 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const frame = (now) => {
      raf = 0;
      const dt = Math.min(0.04, Math.max(0, (now - last) / 1000));
      last = now;
      if (!reduced) update(dt);
      draw();
      if (visible && !reduced) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && visible) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    geometry();
    if (reduced) {
      // a still picture of the current level
      for (let i = 0; i < 260; i += 1) {
        const bin = route()[ROWS];
        if (piles[bin] < G.cap - 1) piles[bin] += 1;
      }
      draw();
    }

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => { geometry(); draw(); start(); })
      : null;
    if (ro) ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(el);

    return () => {
      io.disconnect();
      if (ro) ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvas} className="ob-canvas" aria-hidden="true" />;
};

/* The whole "Confidence, stated plainly" section, with the board beside the copy. */
export const ConfidenceSection = () => {
  const [level, setLevel] = useState('proven');
  const [auto, setAuto] = useState(true);

  const pick = (key, fromBoard) => {
    setLevel(key);
    if (!fromBoard) setAuto(false);     // a visitor's choice stops the cycling
  };

  const current = LEVELS.find((l) => l.key === level);

  return (
    <section className="pr-confidence ob">
      <div className="pr-shell ob-grid">
        <div className="ob-copy">
          <h2 className="pr-h2 reveal">Confidence, stated plainly</h2>
          <div className="pr-conf-body reveal">
            <p>Every conclusion in a feasibility report is labelled by what actually supports it.</p>
            {LEVELS.map((l) => (
              <p key={l.key} className={`ob-level${level === l.key ? ' is-on' : ''}`}>
                <button
                  type="button"
                  className="ob-key"
                  aria-pressed={level === l.key}
                  onClick={() => pick(l.key, false)}
                >
                  {l.word}
                </button>{' '}
                <span>{l.text}</span>
              </p>
            ))}
            <p>
              We would rather write unproven than dress up a guess as a fact, and clients tell us
              that is the part they end up trusting most.
            </p>
          </div>
        </div>

        <figure className="ob-board">
          <OddsBoard level={level} onLevel={pick} auto={auto} />
          <figcaption className="ob-caption" aria-live="polite">
            <strong>{current.word}</strong> {current.text}
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default OddsBoard;
