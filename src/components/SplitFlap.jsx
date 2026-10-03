import React, { useEffect, useRef, useState } from 'react';
import './SplitFlap.css';

/* ------------------------------------------------------------------
   A split-flap board, like an old departures hall.
   Every cell flips forward through the alphabet, one flap at a time,
   until it shows its letter — so each word ripples in, cell by cell.
   It runs through what other people called the problem and lands on
   what we did about it, then starts again while it is on screen.
   ------------------------------------------------------------------ */

const CHARSET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ-.?!';
const HALF_MS = 32;                  // one flap = two halves

const SCRIPT = [
  { word: 'IMPOSSIBLE', label: 'They called it', hold: 1900 },
  { word: 'NO PRECEDENT', label: 'They called it', hold: 1900 },
  { word: 'UNREACHABLE', label: 'They called it', hold: 1900 },
  { word: 'UNSALVAGEABLE', label: 'They called it', hold: 1900 },
  { word: 'SOLVED', label: 'We called it', hold: 4200, final: true },
];

const WIDTH = Math.max(...SCRIPT.map((s) => s.word.length));
const centre = (word) => {
  const pad = WIDTH - word.length;
  return ' '.repeat(Math.floor(pad / 2)) + word + ' '.repeat(Math.ceil(pad / 2));
};

const SplitFlap = () => {
  const board = useRef(null);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const cells = Array.from(board.current.querySelectorAll('.sf-cell')).map((el) => ({
      el,
      top: el.querySelector('.sf-top span'),
      bottom: el.querySelector('.sf-bottom span'),
      flapTop: el.querySelector('.sf-flap-top span'),
      flapBottom: el.querySelector('.sf-flap-bottom span'),
      cur: ' ',
      target: ' ',
      timer: 0,
    }));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let running = false;
    let step = 0;
    let lineTimer = 0;

    const show = (cell, ch) => {
      cell.cur = ch;
      cell.top.textContent = ch;
      cell.bottom.textContent = ch;
    };

    // one flap: the upper half of the current letter falls, the lower half
    // of the next one lands
    const flip = (cell) => {
      if (cell.cur === cell.target) { cell.el.classList.remove('is-flipping'); return; }
      const next = CHARSET[(CHARSET.indexOf(cell.cur) + 1) % CHARSET.length];
      cell.flapTop.textContent = cell.cur;
      cell.flapBottom.textContent = next;
      cell.top.textContent = next;               // revealed behind the falling flap
      cell.el.classList.remove('is-flipping');
      void cell.el.offsetWidth;                  // restart the CSS animation
      cell.el.classList.add('is-flipping');
      cell.timer = window.setTimeout(() => {
        cell.cur = next;
        cell.bottom.textContent = next;
        flip(cell);
      }, HALF_MS * 2);
    };

    const write = (index) => {
      const text = centre(SCRIPT[index].word);
      setLine(index);
      cells.forEach((cell, i) => {
        cell.target = text[i];
        window.clearTimeout(cell.timer);
        if (reduced) { show(cell, cell.target); return; }
        // cells start a beat apart, left to right
        cell.timer = window.setTimeout(() => flip(cell), i * 45);
      });
    };

    const play = () => {
      if (!running) return;
      write(step);
      const { hold } = SCRIPT[step];
      step = (step + 1) % SCRIPT.length;
      lineTimer = window.setTimeout(play, hold + WIDTH * 45 + 900);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        play();
      } else if (!entry.isIntersecting && running) {
        running = false;
        window.clearTimeout(lineTimer);
      }
    }, { threshold: 0.4 });
    io.observe(board.current);

    return () => {
      io.disconnect();
      window.clearTimeout(lineTimer);
      cells.forEach((cell) => window.clearTimeout(cell.timer));
    };
  }, []);

  const current = SCRIPT[line];

  return (
    <div className={`sf${current.final ? ' is-final' : ''}`} data-fx-skip="">
      <p className="sf-label" aria-hidden="true">{current.label}</p>
      <div className="sf-board" ref={board} aria-hidden="true">
        {Array.from({ length: WIDTH }, (_, i) => (
          <span className="sf-cell" key={i}>
            <span className="sf-half sf-top"><span> </span></span>
            <span className="sf-half sf-bottom"><span> </span></span>
            <span className="sf-half sf-flap-top"><span> </span></span>
            <span className="sf-half sf-flap-bottom"><span> </span></span>
          </span>
        ))}
      </div>
      {/* the cycling board is decoration; this is what it says */}
      <p className="sf-sr">They called it impossible. We called it solved.</p>
    </div>
  );
};

export default SplitFlap;
