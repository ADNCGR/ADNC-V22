import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import './ConsultingNavbar.css';
import logoImg from '../assets/logo-consulting.png';

const ConsultingNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { setMode } = useMode();
  const isActive = (path) => currentPath === path || currentPath.startsWith(path + '/');

  return (
    <div className="cp-top">
      <div className="cp-navbar">
        <div className="cp-logo">
          <Link to="/">
            <img src={logoImg} alt="ADNC Group" />
          </Link>
        </div>
        <div className="cp-navlinks">
          <Link to="/services" className={isActive('/services') ? 'active' : ''}>Services</Link>
          <Link to="/process" className={isActive('/process') ? 'active' : ''}>Process</Link>
          <Link to="/about" className={isActive('/about') ? 'active' : ''}>About</Link>
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link>
        </div>
      </div>
      <div className="cp-mode-toggle">
        <div className="cp-pill"></div>
        <button className="inactive" onClick={() => setMode('development')}>Development</button>
        <button className="active">Consulting</button>
      </div>
    </div>
  );
};

export default ConsultingNavbar;