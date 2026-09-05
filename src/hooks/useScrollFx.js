import { useEffect } from 'react';

const REVEAL_SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';

/**
 * Adds the `in` class to every reveal element once it enters the viewport.
 * Re-runs whenever `deps` change so mode / route swaps pick up new nodes.
 */
export function useReveal(deps = []) {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => el.classList.add('in'));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    const els = Array.from(document.querySelectorAll(REVEAL_SELECTOR));
    els.forEach((el) => io.observe(el));
    // Anything already on screen at mount should not wait for a scroll event.
    requestAnimationFrame(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
      });
    });

    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Writes a 0 → 1 `--p` custom property on every `[data-scroll-progress]`
 * element, mapped to how far it has travelled through the viewport.
 * Used for the Figma "ligne animation" wipes and the pinned card stage.
 */
export function useScrollProgress(deps = []) {
  useEffect(() => {
    let frame = 0;
    const nodes = Array.from(document.querySelectorAll('[data-scroll-progress]'));
    if (!nodes.length) return undefined;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight || 1;
      nodes.forEach((el) => {
        const start = Number(el.dataset.start || 0.9);
        const end = Number(el.dataset.end || 0.25);
        const rect = el.getBoundingClientRect();
        const from = vh * start;
        const to = vh * end - rect.height * 0.35;
        const raw = (from - rect.top) / Math.max(1, from - to);
        const p = Math.min(1, Math.max(0, raw));
        el.style.setProperty('--p', p.toFixed(4));
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useReveal;
