import React from 'react';
import { Link } from 'react-router-dom';
import './consulting-standard.css';
import logoImg from '../assets/0f5f580f5e1ffd8cb0380830d298d2557c56c11f.png';

const ConsultingFooter = () => {
  return (
    <footer className="cs-footer">
      <div className="cs-footer-top">
        <Link to="/" className="cs-footer-logo" aria-label="ADNC Group Home">
          <img src={logoImg} alt="ADNC Group" className="cs-logo-mark cs-logo-mark-footer" />
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