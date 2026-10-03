import { useEffect } from 'react';

/* ------------------------------------------------------------------
   Site-wide pointer interactions (mouse only, motion allowed):
   - magnetic buttons drift a little towards the pointer and spring back;
   - cards listed in SPOT get --mx / --my (pointer position inside the
     card, px) so motion.css can light them where the pointer is.
   Uses the `translate` property, which stacks on top of any transform
   the element already has.
   ------------------------------------------------------------------ */

const MAGNETIC = [
  '.btn-pill', '.btn-square', '.c-btn-primary', '.c-btn-secondary', '.ab-btn',
  '.ct-submit', '.global-nav-cta', '.sv-term-btn', '.hm-advisory-link', '.pd-link',
].join(', ');

export const SPOT = [
  '.c-why-card', '.sv-cell', '.hm-acc-item', '.c-service-card', '.sv-c-card',
  '.pr-postit', '.sv-term',
].join(', ');

const MAX_WIDTH = 520;      // wide bars (full-width CTAs) stay put

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function useInteractions() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const pulled = new Map();   // element → { x, y, tx, ty }
    let active = null;
    let raf = 0;

    const tick = () => {
      raf = 0;
      let moving = false;
      pulled.forEach((s, el) => {
        s.x += (s.tx - s.x) * 0.2;
        s.y += (s.ty - s.y) * 0.2;
        const resting = s.tx === 0 && s.ty === 0 && Math.abs(s.x) < 0.05 && Math.abs(s.y) < 0.05;
        if (resting) {
          el.style.removeProperty('translate');
          pulled.delete(el);
        } else {
          el.style.translate = `${s.x.toFixed(2)}px ${s.y.toFixed(2)}px`;
          moving = true;
        }
      });
      if (moving) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const release = (el) => {
      const s = el && pulled.get(el);
      if (s) { s.tx = 0; s.ty = 0; }
    };

    const onMove = (e) => {
      const target = e.target instanceof Element ? e.target : null;

      const magnet = target && target.closest(MAGNETIC);
      if (active && active !== magnet) release(active);
      if (magnet) {
        const box = magnet.getBoundingClientRect();
        if (box.width <= MAX_WIDTH) {
          const s = pulled.get(magnet) || { x: 0, y: 0, tx: 0, ty: 0 };
          // measure from the resting centre, not the already-pulled one
          const cx = box.left + box.width / 2 - s.x;
          const cy = box.top + box.height / 2 - s.y;
          s.tx = clamp((e.clientX - cx) * 0.25, -12, 12);
          s.ty = clamp((e.clientY - cy) * 0.35, -8, 8);
          pulled.set(magnet, s);
        }
      }
      active = magnet;
      kick();

      const spot = target && target.closest(SPOT);
      if (spot) {
        const box = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${Math.round(e.clientX - box.left)}px`);
        spot.style.setProperty('--my', `${Math.round(e.clientY - box.top)}px`);
      }
    };

    const onLeave = () => { release(active); active = null; kick(); };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      pulled.forEach((s, el) => el.style.removeProperty('translate'));
    };
  }, []);
}

export default useInteractions;
