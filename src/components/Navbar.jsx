import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import './Navbar.css';

const Navbar = () => {
  const { mode, setMode } = useMode();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="global-header">
      <div className="global-nav-outer">
        <nav className="global-nav-pill">
          <Link to="/" className="global-logo">
            <span className="global-logo-mark">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <circle cx="13" cy="13" r="13" fill="#fff"/>
                <path d="M13 5L20 20H6L13 5Z" fill="#000"/>
                <path d="M13 10L17 18H9L13 10Z" fill="#fff"/>
              </svg>
            </span>
            <span className="global-logo-text">
              ADNC <span className="grp">Group</span>
            </span>
          </Link>

          <div className="global-nav-links">
            <Link to="/services" className={currentPath === '/services' ? 'active' : ''}>
              Services
            </Link>
            <Link to="/process" className={currentPath === '/process' ? 'active' : ''}>
              Process
            </Link>
            <Link to="/about" className={currentPath === '/about' ? 'active' : ''}>
              About
            </Link>
            <Link to="/contact" className={currentPath === '/contact' ? 'active' : ''}>
              Contact
            </Link>
          </div>
        </nav>
      </div>

      <div className="global-toggle-outer">
        <div className="global-toggle-pill">
          <button
            type="button"
            className={mode === 'development' ? 'active' : ''}
            onClick={() => setMode('development')}
          >
            Development
          </button>
          <button
            type="button"
            className={mode === 'consulting' ? 'active' : ''}
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
