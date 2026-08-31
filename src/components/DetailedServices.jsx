import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DetailedServices.css';

const DetailedServices = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const services = [
    {
      id: '01',
      title: 'Research & feasibility',
      description: 'We rigorously evaluate ideas through technical spikes and feasibility studies to ensure they can scale in reality.'
    },
    {
      id: '02',
      title: 'Engineering & operations',
      description: 'From architecture to production, we build robust systems designed for performance, security, and long-term scalability.'
    }
  ];

  return (
    <section className="section detailed-services">
      <div className="detailed-list">
        {services.map((service, index) => (
          <div 
            key={service.id} 
            className="detailed-item"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="detailed-item-header">
              <span className="detailed-id">{service.id}</span>
              <h2 className="detailed-title">— {service.title}</h2>
            </div>
            
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="detailed-content"
                >
                  <p>{service.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="view-all-container">
        <a href="#all-services" className="view-all-btn">View all services →</a>
      </div>

      <div className="marquee-secondary-container">
        <div className="marquee-secondary-scroll">
          <div className="marquee-secondary-content">
            {[...Array(5)].map((_, i) => (
              <React.Fragment key={`frag1-${i}`}>
                <span>✦ Applied research</span>
                <span>✦ Feasibility</span>
                <span>✦ Prototyping</span>
                <span>✦ System architecture</span>
                <span>✦ Data engineering</span>
              </React.Fragment>
            ))}
          </div>
          <div className="marquee-secondary-content">
            {[...Array(5)].map((_, i) => (
              <React.Fragment key={`frag2-${i}`}>
                <span>✦ Applied research</span>
                <span>✦ Feasibility</span>
                <span>✦ Prototyping</span>
                <span>✦ System architecture</span>
                <span>✦ Data engineering</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedServices;
