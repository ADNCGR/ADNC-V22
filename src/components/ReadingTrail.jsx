import React, { useEffect, useRef } from 'react';
import './ReadingTrail.css';

/* ------------------------------------------------------------------
   A single pen stroke down the page margin, drawn as you read.
   The pen tip sits on the reading line (62% of the screen). Every block
   marked [data-trail] gets a loop in the stroke; when the pen reaches
   it the block lights up (.is-lit) and its words fill in one by one
   (--reveal, 0 → 1, used by .rt-w). The stroke ends in a signature
   flourish under the last block.
   Drop it as the first child of a positioned container.
   ------------------------------------------------------------------ */

const READ_LINE = 0.62;
const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

export const Words = ({ text, from = 0 }) => text.split(' ').map((word, i) => (
  <span className="rt-w" style={{ '--w': from + i }} key={i}>{word} </span>
));

const ReadingTrail = ({ watch }) => {
  const svg = useRef(null);
  const ghost = useRef(null);
  const ink = useRef(null);
  const tip = useRef(null);
  const halo = useRef(null);

  useEffect(() => {
    const host = svg.current.parentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let pts = [];
    let lens = [];
    let reach = [];          // highest y reached so far along the stroke
    let total = 0;
    let nodes = [];
    let raf = 0;

    const build = () => {
      const box = host.getBoundingClientRect();
      const blocks = Array.from(host.querySelectorAll('[data-trail]'));
      if (!blocks.length) return;
      const firstLeft = Math.min(...blocks.map((b) => b.getBoundingClientRect().left)) - box.left;
      const margin = Math.max(18, firstLeft);
      const baseX = margin * 0.5;
      const amp = Math.min(14, margin * 0.16);
      const loopR = Math.max(6, Math.min(12, margin * 0.12));

      nodes = blocks.map((el) => {
        const r = el.getBoundingClientRect();
        const head = el.querySelector('h3') || el;
        const hr = head.getBoundingClientRect();
        return {
          el,
          y: hr.top - box.top + Math.min(18, hr.height / 2),
          top: r.top - box.top,
          bottom: r.bottom - box.top,
          n: el.querySelectorAll('.rt-w').length,
        };
      }).sort((a, b) => a.y - b.y);

      const xAt = (y) => baseX + Math.sin(y / 150) * amp;
      const startY = Math.max(0, nodes[0].top - 140);
      const endY = nodes[nodes.length - 1].y;
      const out = [];
      let next = 0;
      for (let y = startY; y <= endY; y += 5) {
        out.push({ x: xAt(y), y });
        // a loop around each node, the way a pen would mark a point
        if (next < nodes.length && y + 5 > nodes[next].y) {
          const cy = nodes[next].y;
          const cx = xAt(cy) + loopR;        // the loop swings out towards the text
          for (let a = 0; a <= 1.0001; a += 1 / 36) {
            const ang = Math.PI + a * Math.PI * 2;
            out.push({ x: cx + loopR * Math.cos(ang), y: cy + loopR * Math.sin(ang) });
          }
          nodes[next].cx = cx;
          nodes[next].cy = cy;
          next += 1;
        }
      }

      // the signature: the pen curls down the margin three times and
      // leaves with a sweep — all inside the margin, clear of the text
      const last = out[out.length - 1];
      const curl = Math.max(7, loopR);
      for (let s = 0; s <= 1.0001; s += 1 / 90) {
        const ang = s * 3 * Math.PI * 2;
        out.push({ x: last.x + curl * Math.sin(ang) + s * curl, y: last.y + 18 + s * 110 - curl * Math.cos(ang) + curl });
      }
      const sig = out[out.length - 1];
      for (let s = 0; s <= 1.0001; s += 1 / 50) {
        out.push({ x: sig.x + Math.sin(s * Math.PI / 2) * margin * 0.32, y: sig.y + s * 46 });
      }

      pts = out;
      lens = [0];
      reach = [pts[0].y];
      for (let i = 1; i < pts.length; i += 1) {
        lens.push(lens[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
        reach.push(Math.max(reach[i - 1], pts[i].y));
      }
      total = lens[lens.length - 1];

      const d = `M${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L')}`;
      svg.current.setAttribute('height', String(host.scrollHeight));
      ghost.current.setAttribute('d', d);
      ink.current.setAttribute('d', d);
      ink.current.style.strokeDasharray = `${total} ${total}`;

      svg.current.querySelectorAll('.rt-node').forEach((dot) => dot.remove());
      nodes.forEach((node) => {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('class', 'rt-node');
        dot.setAttribute('cx', node.cx.toFixed(1));
        dot.setAttribute('cy', node.cy.toFixed(1));
        dot.setAttribute('r', String(Math.max(2.5, loopR * 0.38)));
        svg.current.insertBefore(dot, tip.current.previousSibling);
        node.dot = dot;
      });
    };

    const update = () => {
      raf = 0;
      if (!pts.length) return;
      const box = host.getBoundingClientRect();
      const line = window.innerHeight * READ_LINE - box.top;

      // how much of the stroke lies above the reading line
      let i = 0;
      let lo = 0;
      let hi = reach.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (reach[mid] <= line) { i = mid; lo = mid + 1; } else { hi = mid - 1; }
      }
      const atEnd = line > pts[pts.length - 1].y;
      const drawn = reduced || atEnd ? total : lens[i];
      const at = reduced || atEnd ? pts[pts.length - 1] : pts[i];
      ink.current.style.strokeDashoffset = String(total - drawn);
      tip.current.setAttribute('cx', at.x.toFixed(1));
      tip.current.setAttribute('cy', at.y.toFixed(1));
      halo.current.setAttribute('cx', at.x.toFixed(1));
      halo.current.setAttribute('cy', at.y.toFixed(1));

      nodes.forEach((node) => {
        const lit = reduced || line >= node.y - 4;
        node.el.classList.toggle('is-lit', lit);
        if (node.dot) node.dot.classList.toggle('is-on', lit);
        const reveal = reduced ? 1 : clamp((line - node.top) / Math.max(1, node.bottom - node.top));
        node.el.style.setProperty('--reveal', reveal.toFixed(3));
        node.el.style.setProperty('--n', node.n || 1);
      });
    };

    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };

    build();
    update();
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => { build(); schedule(); })
      : null;
    if (ro) ro.observe(host);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [watch]);

  return (
    <svg ref={svg} className="rt" aria-hidden="true" focusable="false">
      <path ref={ghost} className="rt-ghost" />
      <path ref={ink} className="rt-ink" />
      <circle ref={halo} className="rt-halo" r="12" cx="-50" cy="-50" />
      <circle ref={tip} className="rt-tip" r="4.5" cx="-50" cy="-50" />
    </svg>
  );
};

export default ReadingTrail;
