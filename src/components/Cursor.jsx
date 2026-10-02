import React, { useEffect, useRef } from 'react';
import './Cursor.css';

/* Blob that trails the pointer and swells into an inverting disc over
   links, buttons and anything marked [data-cursor]. Mouse only. */
const Cursor = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;
    const el = ref.current;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const move = (e) => { tx = e.clientX; ty = e.clientY; };
    const over = (e) => {
      const hit = e.target instanceof Element && e.target.closest('a,button,[data-cursor]');
      el.dataset.hover = hit ? '1' : '0';
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);

    let raf = 0;
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-blob" aria-hidden="true" />;
};

export default Cursor;
