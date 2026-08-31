import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './consulting-standard.css';

const ConsultingNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  return (
    <div className="cs-nav-wrapper">
      <nav className="cs-navbar">
        <Link to="/" className="cs-nav-logo" aria-label="ADNC Group Home">
          <svg viewBox="0 0 260 60" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" fill="none">
            <g transform="translate(5, 5) scale(0.85)">
              <circle cx="25" cy="25" r="24" stroke="#000" strokeWidth="2.5" fill="none"/>
              <path d="M25 8L41 43.5H9L25 8Z" fill="#000" stroke="#000" strokeWidth="0.5"/>
              <path d="M25 19L33 42H17L25 19Z" fill="#fff"/>
            </g>
            <text x="68" y="40" fontFamily="Fustat, sans-serif" fontSize="32" fontWeight="800" fill="#000" letterSpacing="0">
              DNC
              <tspan fontWeight="300" fill="#000" dx="6"> Group</tspan>
            </text>
          </svg>
        </Link>
        <ul className="cs-nav-links">
          <li>
            <Link to="/services" className={isActive('/services') ? 'cs-active' : ''}>Services</Link>
          </li>
          <li>
            <Link to="/process" className={isActive('/process') ? 'cs-active' : ''}>Process</Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about') ? 'cs-active' : ''}>About</Link>
          </li>
          <li>
            <Link to="/contact" className={isActive('/contact') ? 'cs-active' : ''}>Contact</Link>
          </li>
        </ul>
        <div className="cs-nav-spacer" aria-hidden="true"></div>
      </nav>
    </div>
  );
};

export default ConsultingNavbar;
