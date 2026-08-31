import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="global-footer">
      <div className="global-footer-wrap">
        <div className="global-footer-top">
          <Link to="/" className="global-footer-logo">
            <span className="global-footer-logo-mark">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="14" fill="#fff"/>
                <path d="M14 6L21 21H7L14 6Z" fill="#000"/>
                <path d="M14 11L18 19H10L14 11Z" fill="#fff"/>
              </svg>
            </span>
            <span className="global-footer-logo-text">
              DNC <span className="grp">Group</span>
            </span>
          </Link>

          <Link to="/contact" className="global-footer-btn">
            <span className="dot"></span> Bring us the hard problem &rarr;
          </Link>
        </div>

        <div className="global-footer-grid">
          <div className="global-footer-left">
            <p className="global-footer-desc">
              ADNC is a research and engineering lab.<br />
              We take on problems with no precedent, we build the systems<br />
              they need, and we run them for the long term.<br />
              We may even invest in you.
            </p>

            <div className="global-footer-contact">
              <h4>Contact</h4>
              <p>Available worldwide &middot; HQ Casablanca, Morocco</p>
            </div>
          </div>

          <div className="global-footer-divisions">
            <h4>Divisions</h4>
            <ul>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/process">Process</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
