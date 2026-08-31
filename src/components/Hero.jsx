import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  return (
    <section className="section hero">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-line">We build.</span>
          <span className="hero-line">We operate.</span>
          <span className="hero-line scale-line">
            We <motion.span
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="hero-highlight"
            >scale.</motion.span>
          </span>
        </h1>

        <div className="hero-actions">
          <button className="btn-primary">
            <span className="btn-text">Bring us the hard problem</span>
            <span className="btn-arrow">→</span>
          </button>
          <button className="btn-secondary">
            How we work
          </button>
        </div>
      </div>

      <div className="hero-visual">
        {/* 3D Cube using CSS */}
        <div className="cube-container">
          <div className="cube">
            <div className="cube-face front"></div>
            <div className="cube-face back"></div>
            <div className="cube-face right"></div>
            <div className="cube-face left"></div>
            <div className="cube-face top"></div>
            <div className="cube-face bottom"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
