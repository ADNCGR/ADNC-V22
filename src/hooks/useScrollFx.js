import { useEffect, useLayoutEffect } from 'react';

const REVEAL_SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';

/* ------------------------------------------------------------------
   Automatic entrances. Anything that has no hand-written reveal gets
   one picked from its kind, so cards, pictures, titles, list items,
   rules, buttons and body copy each arrive in their own way.
   The keyframes live in index.css ([data-fx="…"]).
   ------------------------------------------------------------------ */

const CARD_CLASS = /(^|-)(card|cell|postit|tile)(-\d+|--[\w-]+)?$/;

const FX_KINDS = [
  ['card', (el) => el.tagName === 'ARTICLE' || el.tagName === 'DETAILS'
    || Array.from(el.classList).some((c) => CARD_CLASS.test(c))],
  ['media', (el) => (el.tagName === 'IMG' || el.tagName === 'VIDEO') && el.getBoundingClientRect().width >= 160],
  ['title', (el) => el.tagName === 'H1' || el.tagName === 'H2'],
  ['sub', (el) => /^H[3-5]$/.test(el.tagName)],
  ['rule', (el) => el.tagName === 'HR'],
  ['pop', (el) => el.matches('.btn-pill, .btn-square, a[class*="cta"], a[class*="btn"]')],
  ['item', (el) => el.tagName === 'LI'],
  ['text', (el) => el.tagName === 'P' || el.tagName === 'BLOCKQUOTE'],
];

const FX_CANDIDATES = 'article, details, div, section, img, video, h1, h2, h3, h4, h5, hr, a, li, p, blockquote';

// Regions that animate themselves or must stay put.
const FX_SKIP = [
  '.global-header', 'footer', '[class*="footer"]', '.ds', '[class*="marquee"]',
  '[aria-hidden="true"]', '.cursor-blob', '[data-fx]', '[data-fx-done]',
].join(', ');

function tagEntrances() {
  const root = document.querySelector('.site-frame');
  if (!root) return [];
  const tagged = [];

  root.querySelectorAll(FX_CANDIDATES).forEach((el) => {
    // hand-written reveals keep their own motion; what is inside them still
    // gets an entrance of its own
    if (el.matches(REVEAL_SELECTOR) || el.closest(FX_SKIP)) return;
    const kind = FX_KINDS.find(([, test]) => test(el));
    if (!kind) return;

    // leave alone anything that is hidden on purpose or already animated
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return;
    if (cs.animationName !== 'none' || cs.position === 'fixed') return;
    if (!el.offsetParent && cs.position !== 'sticky') return;

    // stagger siblings of the same kind, alternating the tilt of cards
    const index = Array.from(el.parentElement.children)
      .filter((sib) => sib.dataset.fx === kind[0]).length;
    el.dataset.fx = kind[0];
    el.style.setProperty('--fx-i', Math.min(index, 6));
    el.style.setProperty('--fx-dir', index % 2 ? 1 : -1);
    tagged.push(el);
  });

  return tagged;
}

function untag(el) {
  delete el.dataset.fxIn;
  delete el.dataset.fx;
  el.dataset.fxDone = '';
  el.style.removeProperty('--fx-i');
  el.style.removeProperty('--fx-dir');
}

/**
 * Adds the `in` class to every reveal element once it enters the viewport,
 * and plays an automatic entrance on everything else.
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

  // Layout effect: elements are tagged (and hidden) before the first paint,
  // so nothing flashes in and back out.
  useLayoutEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const tagged = tagEntrances();
    if (!tagged.length) return undefined;

    const done = (e) => { if (e.target === e.currentTarget) untag(e.currentTarget); };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          // a data attribute, not a class: React rewrites className wholesale
          entry.target.dataset.fxIn = '';
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    tagged.forEach((el) => {
      el.addEventListener('animationend', done);
      el.addEventListener('animationcancel', done);
      io.observe(el);
    });

    return () => {
      io.disconnect();
      tagged.forEach((el) => {
        el.removeEventListener('animationend', done);
        el.removeEventListener('animationcancel', done);
        if (el.dataset.fx) { untag(el); delete el.dataset.fxDone; }
      });
    };
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
