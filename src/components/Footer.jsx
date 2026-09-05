import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/figma/logo-adnc-white.png';
import './Footer.css';

const LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/process', label: 'Process' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="global-footer">
      <div className="global-footer-wrap">
        <div className="global-footer-top">
          <Link to="/" className="global-footer-logo" aria-label="ADNC Group — home">
            <img src={logo} alt="ADNC Group" className="global-footer-logo-img" />
          </Link>

          <Link to="/contact" className="btn-pill global-footer-btn">
            Bring us the hard problem →
          </Link>
        </div>

        <div className="global-footer-grid">
          <div className="global-footer-col">
            <p className="global-footer-desc">
              ADNC is a research and engineering lab.
              <br />
              We take on problems with no precedent, we build the systems they need, and we run them
              for the long term.
              <br />
              We may even invest in you.
            </p>

            <h4 className="global-footer-title">Contact</h4>
            <p className="global-footer-address">Available worldwide · HQ Casablanca, Morocco</p>
          </div>

          <div className="global-footer-col global-footer-divisions">
            <h4 className="global-footer-title">Divisions</h4>
            <ul>
              {LINKS.map(({ to, label }) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
