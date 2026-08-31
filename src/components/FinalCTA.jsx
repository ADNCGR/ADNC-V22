import React from 'react';
import './FinalCTA.css';

const FinalCTA = () => {
  return (
    <section className="section final-cta">
      <div className="cta-container">
        <h2 className="cta-title">Got something nobody<br/>will take on?</h2>
        <p className="cta-description">We specialize in building the unbuildable. Let's talk.</p>
        <button className="btn-primary cta-btn">
          <span className="btn-text">Bring us the hard problem</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;
