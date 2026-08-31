import React from 'react';
import { Link } from 'react-router-dom';
import './consulting-standard.css';

const ConsultingFooter = () => {
  return (
    <footer className="cs-footer">
      <div className="cs-footer-top">
        <Link to="/" className="cs-footer-logo" aria-label="ADNC Group Home">
          <svg viewBox="0 0 260 60" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" fill="none">
            <g transform="translate(5, 5) scale(0.85)">
              <circle cx="25" cy="25" r="24" stroke="#000" strokeWidth="2.5" fill="none"/>
              <path d="M25 8L41 43.5H9L25 8Z" fill="#000"/>
              <path d="M25 19L33 42H17L25 19Z" fill="#fff"/>
            </g>
            <text x="68" y="40" fontFamily="Fustat, sans-serif" fontSize="32" fontWeight="800" fill="#000">
              DNC
              <tspan fontWeight="300" fill="#000" dx="6"> Group</tspan>
            </text>
          </svg>
        </Link>
        <Link to="/contact" className="cs-footer-cta">
          <span className="cs-footer-cta-dot"></span>
          <span>Request an initial assessment →</span>
        </Link>
      </div>
      <div className="cs-footer-bottom">
        <div className="cs-footer-left-col">
          <p className="cs-footer-desc">
            ADNC Group uses data driven analysis and decision science to advise organisations across every sector, public and private, backed by an engineering division that builds and operates what we recommend.
          </p>
          <h3 className="cs-footer-col-title">Contact</h3>
          <p className="cs-footer-location">Available worldwide · HQ Casablanca, Morocco</p>
        </div>
        <div className="cs-footer-right-col">
          <h3 className="cs-footer-col-title">Divisions</h3>
          <ul className="cs-footer-links">
            <li><Link to="/services">Practice areas</Link></li>
            <li><Link to="/process">Method</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default ConsultingFooter;
