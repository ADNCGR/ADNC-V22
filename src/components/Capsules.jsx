import React from 'react';
import { motion } from 'framer-motion';
import './Capsules.css';

const capsules = [
  "We research",
  "We prototype",
  "We prove it",
  "We operate",
  "We engineer",
  "We deploy",
  "We stay accountable"
];

const Capsules = () => {
  return (
    <section className="section capsules-section">
      <div className="capsules-container">
        {capsules.map((text, index) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="glass-capsule"
          >
            {text}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Capsules;
