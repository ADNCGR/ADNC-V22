import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import adncLogo from '../assets/figma/logo-adnc-white.png';
import consultingLogo from '../assets/figma/logo-adnc-dark.png';
import './Navbar.css';

const LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/process', label: 'Process' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const { mode, setMode } = useMode();
  const { pathname } = useLocation();
  const sentinel = useRef(null);
  const [pinned, setPinned] = useState(false);

  // The mode switch detaches from the header and pins itself to the top of the
  // viewport once the nav pill has scrolled away (Figma: `sticky top-0`).
  useEffect(() => {
    const node = sentinel.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting),
      { rootMargin: '0px 0px 0px 0px', threshold: 0 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const isConsulting = mode === 'consulting';

  return (
    <header className="global-header">
      <div className="global-nav-outer">
        <nav className="global-nav-pill">
          <Link to="/" className="global-logo" aria-label="ADNC Group — home">
            <img
              src={isConsulting ? consultingLogo : adncLogo}
              alt="ADNC Group"
              className="global-logo-img"
            />
          </Link>

          <div className="global-nav-links">
            {LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={pathname === to ? 'active' : ''}>
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div ref={sentinel} className="global-toggle-sentinel" aria-hidden="true" />

      <div className={`global-toggle-outer${pinned ? ' is-pinned' : ''}`}>
        <div className="global-toggle-pill" data-mode={mode}>
          <span className="global-toggle-thumb" aria-hidden="true" />
          <button
            type="button"
            className={!isConsulting ? 'active' : ''}
            aria-pressed={!isConsulting}
            onClick={() => setMode('development')}
          >
            Development
          </button>
          <button
            type="button"
            className={isConsulting ? 'active' : ''}
            aria-pressed={isConsulting}
            onClick={() => setMode('consulting')}
          >
            Consulting
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
