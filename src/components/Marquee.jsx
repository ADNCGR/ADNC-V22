import React from 'react';
import './Marquee.css';

const Marquee = ({ text }) => {
  return (
    <div className="marquee-container">
      <div className="marquee-scroll">
        <div className="marquee-content">
          {[...Array(15)].map((_, i) => (
            <span key={`a-${i}`} className="marquee-text">{text}</span>
          ))}
        </div>
        <div className="marquee-content">
          {[...Array(15)].map((_, i) => (
            <span key={`b-${i}`} className="marquee-text">{text}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
