import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Process.css';

const Process = () => {
  const [hoveredStep, setHoveredStep] = useState(null);

  const steps = [
    { id: '01', title: 'Frame', description: 'Define the boundary and success metrics.' },
    { id: '02', title: 'Prove', description: 'De-risk technical challenges early.' },
    { id: '03', title: 'Build', description: 'Iterative, scalable engineering.' },
    { id: '04', title: 'Operate', description: 'Deploy, monitor, and scale.' }
  ];

  return (
    <section className="section process-section" id="process">
      <div className="process-header">
        <h2 className="process-title">
          From an unproven idea<br />
          to a system in production
        </h2>
      </div>

      <div className="process-steps">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className="process-step"
            onMouseEnter={() => setHoveredStep(index)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div className="step-number">{step.id}</div>
            <div className="step-title">{step.title}</div>
            
            <AnimatePresence>
              {hoveredStep === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="step-description"
                >
                  <p>{step.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Process;
