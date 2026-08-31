import React from 'react';
import { motion } from 'framer-motion';
import './Services.css';

const Services = () => {
  return (
    <section className="section services-cards-section" id="services">
      <div className="services-cards-container">
        
        <div className="service-card card-research">
          <div className="card-bg"></div>
          <div className="card-content">
            <div className="card-header">
              <h3>"Invent."</h3>
              <p>Research & Feasibility</p>
            </div>
            
            <svg className="vector-line" viewBox="0 0 400 100" preserveAspectRatio="none">
              <motion.path 
                d="M 0,50 Q 100,0 200,50 T 400,50" 
                fill="none" 
                stroke="rgba(0,0,0,0.2)" 
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 3.75, ease: "easeInOut" }}
              />
            </svg>
          </div>
        </div>

        <div className="service-card card-engineering">
          <div className="card-bg"></div>
          <div className="card-content">
            <div className="card-header">
              <h3>"Make it real."</h3>
              <p>Engineering & Operations</p>
            </div>
            
            <svg className="vector-line" viewBox="0 0 400 100" preserveAspectRatio="none">
              <motion.path 
                d="M 0,50 Q 100,100 200,50 T 400,50" 
                fill="none" 
                stroke="rgba(0,0,0,0.2)" 
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 3.75, ease: "easeInOut", delay: 0.5 }}
              />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Services;
