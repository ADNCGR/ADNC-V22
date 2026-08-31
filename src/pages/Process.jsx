import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConsultingNavbar from '../components/ConsultingNavbar';
import ConsultingTabSwitcher from '../components/ConsultingTabSwitcher';
import ConsultingFooter from '../components/ConsultingFooter';
import { useMode } from '../context/ModeContext';
import './Process.css';

// Development Version (Original)
const DevelopmentProcess = () => {
  const container = useRef();
  const [activeTab, setActiveTab] = useState(0);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [fieldDimensions, setFieldDimensions] = useState({ w: 0, h: 0 });

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const t = document.getElementById(id);
    if (t) {
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Generate Puzzle Field
    const renderField = () => {
      const h = Math.max(document.body.scrollHeight, window.innerHeight * 3);
      const w = window.innerWidth;
      const count = Math.floor((w * h) / 230000);
      const pieces = [];
      for (let i = 0; i < count; i++) {
        pieces.push({
          x: Math.random() * w,
          y: Math.random() * h,
          s: 0.5 + Math.random() * 1.1,
          r: Math.random() * 360,
          o: (0.4 + Math.random() * 0.5).toFixed(2)
        });
      }
      setFieldDimensions({ w, h });
      setPuzzlePieces(pieces);
    };

    renderField();
    
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderField, 250);
    };
    window.addEventListener('resize', handleResize);

    // Scroll reveal
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in-view');
      });
    }, { threshold: 0.28 });
    
    const reveals = container.current.querySelectorAll('.reveal');
    reveals.forEach(el => io.observe(el));

    const ioRows = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in-view');
      });
    }, { threshold: 0.35 });
    
    const rows = container.current.querySelectorAll('.process-row');
    rows.forEach(el => ioRows.observe(el));

    return () => {
      window.removeEventListener('resize', handleResize);
      io.disconnect();
      ioRows.disconnect();
    };
  }, []);

  // Generate grid pieces independently for each of the 4 grids
  const gridData = useMemo(() => {
    return Array(4).fill(0).map(() => {
      const order = Array.from({ length: 16 }, (_, i) => i).sort(() => Math.random() - 0.5);
      return order;
    });
  }, []);

  const puzzlePiece = (x, y, scale, rot, opacity) => {
    return (
      <g transform={`translate(${x},${y}) rotate(${rot}) scale(${scale})`} opacity={opacity}>
        <path d="M0 20 Q0 0 20 0 Q22 -14 36 -14 Q50 -14 52 0 Q72 0 72 20 Q86 22 86 36 Q86 50 72 52 Q72 72 52 72 Q50 86 36 86 Q22 86 20 72 Q0 72 0 52 Q-14 50 -14 36 Q-14 22 0 20 Z" fill="#ffffff" />
      </g>
    );
  };

  return (
    <div className="process-page" ref={container} id="top">
      <div className="puzzle-field" id="puzzleField">
        {fieldDimensions.w > 0 && (
          <svg width={fieldDimensions.w} height={fieldDimensions.h} style={{ position: 'absolute', top: 0, left: 0 }}>
            {puzzlePieces.map((p, i) => (
              <React.Fragment key={i}>
                {puzzlePiece(p.x, p.y, p.s, p.r, p.o)}
              </React.Fragment>
            ))}
          </svg>
        )}
      </div>

      <Navbar />

      <section className="hero reveal">
        <h1><span className="stroke">Before we build,</span> we measure<br />what the odds actually are.</h1>
        <p className="lede">Every engagement starts as an open question, not a specification.<br />
        Before we write a line of production code we turn that question into data: benchmarks we can run, comparable systems we can inspect, constraints we can test rather than assume.<br />
        We do not have an opinion on whether something is possible until we have gone looking for evidence that it is not.<br />
        What comes back is a stated probability, a confidence level attached to it, and the reasoning behind both.</p>
        <p>That report exists whether the answer is <span className="yesno">yes</span> or <span className="yesno">no</span>.</p>
      </section>

      <div className="divider"></div>

      <section className="section" id="services">
        <h2 className="reveal">WHAT WE MEASURE BEFORE WE BUILD ?</h2>
        <ul className="measure-list reveal">
          <li><div><b>Technical precedent:</b><span>has anything comparable been built, and how did it fail</span></div></li>
          <li><div><b>Constraint reality:</b><span>which limits are physical and which are only assumed</span></div></li>
          <li><div><b>Performance envelope:</b><span>the scale, latency and load the system has to survive</span></div></li>
          <li><div><b>Market and operational signals:</b><span>what the evidence behind similar attempts actually shows</span></div></li>
        </ul>
      </section>

      <div className="divider"></div>

      <section className="section" id="about">
        <h2 className="reveal">Confidence, stated plainly</h2>
        <div className="confidence-copy reveal">
          <span className="row"><span className="key">Every conclusion in a feasibility report is labelled by what actually supports it.</span></span>
          <span className="row"><span className="key">Proven</span><span className="desc"> means we tested it ourselves and it held.</span></span>
          <span className="row"><span className="key">Probable</span><span className="desc"> means the evidence points one way but has not been run end to end.</span></span>
          <span className="row"><span className="key">Unproven</span><span className="desc"> means we genuinely do not know yet.</span></span>
          <span className="row"><span className="key">We would rather write unproven than dress up a guess as a fact, and clients tell us that is the part they end up trusting most.</span></span>
        </div>
      </section>

      <div className="divider"></div>

      <div className="process-head">
        <h2>How the process runs</h2>
      </div>

      <div className="process-track" id="process">
        {/* 01 Collect */}
        <div className="process-row solo">
          <div className="p-card">
            <div className="p-num">01</div>
            <h3 className="p-title">Collect</h3>
            <p className="p-desc">We gather every relevant technical and market data point before forming a view: prior implementations, published benchmarks, the client's own operational data, and the constraints as stated by the people who set them. Assumptions get flagged as assumptions, not folded silently into the evidence.</p>
          </div>
          <div className="p-grid" data-grid>
            {gridData[0].map((order, i) => (
              <span key={i} className="p-piece" style={{ transitionDelay: `${order * 45}ms` }}>
                <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 14 Q2 2 14 2 Q15 -6 24 -6 Q33 -6 34 2 Q48 2 48 14 Q56 15 56 24 Q56 33 48 34 Q48 48 34 48 Q33 56 24 56 Q15 56 14 48 Q2 48 2 34 Q-6 33 -6 24 Q-6 15 2 14 Z"
                    fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.38)" strokeWidth="0.8" />
                </svg>
              </span>
            ))}
          </div>
        </div>

        {/* 02 Test */}
        <div className="process-row reverse">
          <div className="p-card light">
            <div className="p-num">02</div>
            <h3 className="p-title">Test</h3>
            <p className="p-desc">Where the existing data does not settle the question, we generate our own. Technical spikes, load tests, small working prototypes built specifically to fail fast if the idea does not hold. A negative result here is cheap. Discovering the same thing after six months of engineering is not.</p>
          </div>
          <div className="p-grid" data-grid>
            {gridData[1].map((order, i) => (
              <span key={i} className="p-piece" style={{ transitionDelay: `${order * 45}ms` }}>
                <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 14 Q2 2 14 2 Q15 -6 24 -6 Q33 -6 34 2 Q48 2 48 14 Q56 15 56 24 Q56 33 48 34 Q48 48 34 48 Q33 56 24 56 Q15 56 14 48 Q2 48 2 34 Q-6 33 -6 24 Q-6 15 2 14 Z"
                    fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.38)" strokeWidth="0.8" />
                </svg>
              </span>
            ))}
          </div>
        </div>

        {/* 03 Score */}
        <div className="process-row">
          <div className="p-card">
            <div className="p-num">03</div>
            <h3 className="p-title">Score</h3>
            <p className="p-desc">Every finding gets a stated confidence level, tied to what actually supports it. We only call something certain once we have made it certain, not before.</p>
          </div>
          <div className="p-grid" data-grid>
            {gridData[2].map((order, i) => (
              <span key={i} className="p-piece" style={{ transitionDelay: `${order * 45}ms` }}>
                <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 14 Q2 2 14 2 Q15 -6 24 -6 Q33 -6 34 2 Q48 2 48 14 Q56 15 56 24 Q56 33 48 34 Q48 48 34 48 Q33 56 24 56 Q15 56 14 48 Q2 48 2 34 Q-6 33 -6 24 Q-6 15 2 14 Z"
                    fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.38)" strokeWidth="0.8" />
                </svg>
              </span>
            ))}
          </div>
        </div>

        {/* 04 Decide */}
        <div className="process-row reverse">
          <div className="p-card">
            <div className="p-num">04</div>
            <h3 className="p-title">Decide</h3>
            <p className="p-desc">The feasibility report goes to you in writing, with a confidence level attached to each conclusion and a clear recommendation: build, do not build, or test one specific thing further before deciding anything. Some engagements end here, on our advice. That is a legitimate outcome, not a failed one.</p>
          </div>
          <div className="p-grid" data-grid>
            {gridData[3].map((order, i) => (
              <span key={i} className="p-piece" style={{ transitionDelay: `${order * 45}ms` }}>
                <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 14 Q2 2 14 2 Q15 -6 24 -6 Q33 -6 34 2 Q48 2 48 14 Q56 15 56 24 Q56 33 48 34 Q48 48 34 48 Q33 56 24 56 Q15 56 14 48 Q2 48 2 34 Q-6 33 -6 24 Q-6 15 2 14 Z"
                    fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.38)" strokeWidth="0.8" />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <section className="final-cta reveal">
        <h2>Want the odds <span className="stroke">before</span><br />you commit the budget ?</h2>
        <button className="btn" onClick={(e) => handleScrollTo(e, 'contact')}><span className="dot"></span>Bring us the hard problem</button>
      </section>

      <div className="divider"></div>
      <Footer />
    </div>
  );
};

// Consulting Version (New)
const ConsultingProcess = () => {
  const { mode } = useMode();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: 'Collect', title: 'We build a complete evidence base before forming a view', desc: 'internal records, market data, competitor benchmarks and primary research where the record has gaps. Each source is checked for quality before it goes into the model, not after.' },
    { label: 'Model', title: 'Every forecast comes with a range, a stated probability, and the assumptions that would have to hold for the central case to be right', desc: 'Where an assumption is fragile, the sensitivity analysis says so before the decision is made, not after it has failed.' },
    { label: 'Score', title: 'Every figure in a recommendation is marked by what stands behind it', desc: 'Verified means the data confirms it directly. Modelled means it follows from a model built on verified inputs. Assumed means no data currently exists, and we say so rather than disguise the gap.' },
    { label: 'Track', title: 'Once a decision is made, we track the outcome against what we predicted', desc: 'Where we were right, that strengthens the confidence we assign to similar recommendations in future. Where we were wrong, we say so to the client and adjust the model.' }
  ];

  return (
    <div className="consulting-process-page">
      <ConsultingNavbar />
      <ConsultingTabSwitcher />

      {/* PAGE CONTENT */}
      <div className="page-wrap">

        {/* HERO */}
        <section className="hero">
          <div className="hero-text">
            <h1>Every recommendation carries its own evidence file.</h1>
            <p>Most advice arrives as an opinion delivered with confidence. Ours arrives with a file behind it: the data we collected, the model we built from it, and the probability we would put on each alternative before recommending one over another. Where the record does not support a conclusion, we say so, and we design the measurement that would. A recommendation without a stated confidence level is a preference dressed up as a finding. We do not bill for those.</p>
          </div>
          <div className="hero-illustration">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', maxWidth: '380px' }}>
              <circle cx="200" cy="200" r="185" fill="#f2f2f2"/>
              {/* board */}
              <rect x="80" y="90" width="150" height="200" rx="8" fill="#fff" stroke="#333" strokeWidth="3"/>
              <line x1="100" y1="120" x2="205" y2="120" stroke="#333" strokeWidth="3"/>
              <line x1="100" y1="150" x2="180" y2="150" stroke="#ccc" strokeWidth="3"/>
              <line x1="100" y1="175" x2="190" y2="175" stroke="#ccc" strokeWidth="3"/>
              <line x1="100" y1="200" x2="170" y2="200" stroke="#ccc" strokeWidth="3"/>
              {/* checkmarks */}
              <circle cx="205" cy="150" r="10" fill="#333"/>
              <path d="M200 150 L204 154 L211 146" stroke="#fff" strokeWidth="2" fill="none"/>
              <circle cx="205" cy="200" r="10" fill="#333"/>
              <path d="M200 200 L204 204 L211 196" stroke="#fff" strokeWidth="2" fill="none"/>
              <line x1="100" y1="225" x2="185" y2="225" stroke="#ccc" strokeWidth="3"/>
              <line x1="100" y1="250" x2="160" y2="250" stroke="#ccc" strokeWidth="3"/>
              {/* detective figure */}
              <g>
                <circle cx="300" cy="150" r="24" fill="#333"/>
                <path d="M278 138 Q300 118 322 138 L322 145 Q300 130 278 145 Z" fill="#111"/>
                <rect x="286" y="170" width="28" height="70" rx="10" fill="#333"/>
                <rect x="270" y="180" width="18" height="55" rx="8" fill="#333"/>
                <rect x="312" y="180" width="18" height="55" rx="8" fill="#333"/>
                {/* magnifying glass */}
                <circle cx="255" cy="220" r="22" fill="none" stroke="#333" strokeWidth="6"/>
                <line x1="271" y1="236" x2="288" y2="253" stroke="#333" strokeWidth="7" strokeLinecap="round"/>
              </g>
            </svg>
          </div>
        </section>

        {/* NUMBERED SECTIONS */}
        <div className="numbered-sections">

          {/* 01 — Data before opinion */}
          <div className="section-row">
            <div className="section-content left-number">
              <span className="big-number">01</span>
              <div className="section-text">
                <h2>Data before opinion</h2>
                <p>Internal records: financial, operational and transactional data already sitting inside the organisation, checked for quality before it is used for anything. Market and competitive data: pricing, demand signals and comparable organisations, from independent sources rather than assumptions dressed as facts. Primary research: interviews, surveys and field observation where the existing record is silent. Structured expert judgement: where no data exists at all, we say so, and the resulting estimate is treated as an estimate, not a fact.</p>
              </div>
            </div>
          </div>

          {/* 02 — Probability, not certainty */}
          <div className="section-row">
            <div className="section-content right-number">
              <div className="section-text">
                <h2>Probability, not certainty</h2>
                <p>We do not hand you a single number and ask you to trust it. Every forecast comes with a range, a stated probability, and the assumptions that would have to hold for the central case to be right. Where an assumption is fragile, the sensitivity analysis says so before the decision is made, not after it has failed.</p>
              </div>
              <span className="big-number">02</span>
            </div>
          </div>

          {/* 03 — Confidence, labelled by source */}
          <div className="section-row">
            <div className="section-content left-number">
              <span className="big-number">03</span>
              <div className="section-text">
                <h2>Confidence, labelled by source</h2>
                <p>Every figure in a recommendation is marked by what stands behind it. Verified means the data confirms it directly. Modelled means it follows from a model built on verified inputs. Assumed means no data currently exists, and we say so rather than disguise the gap. A board should be able to tell, line by line, which category each figure belongs to.</p>
              </div>
            </div>
          </div>

          {/* 04 — We check our own forecasts */}
          <div className="section-row">
            <div className="section-content right-number">
              <div className="section-text">
                <h2>We check our own forecasts</h2>
                <p>Once a decision is made, we track the outcome against what we predicted. Where we were right, that strengthens the confidence we assign to similar recommendations in future. Where we were wrong, we say so to the client and adjust the model. Few advisory practices publish this kind of accountability internally. We treat it as part of the method, not an afterthought.</p>
              </div>
              <span className="big-number">04</span>
            </div>
          </div>

        </div>

        {/* HOW THE PROCESS RUNS */}
        <section className="process-section">
          <h2>How the process runs</h2>

          <div className="process-card">
            <div className="process-steps">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`step ${index === activeStep ? 'active' : ''}`}
                  onClick={() => setActiveStep(index)}
                >
                  <span className="step-label">{step.label}</span>
                  <div className="step-bar"></div>
                </div>
              ))}
            </div>

            <div className="process-body">
              <p><strong>{steps[activeStep].title}</strong></p>
              <p>{steps[activeStep].desc}</p>
              <div className="process-image">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80" alt="Team working with sticky notes on a glass board"/>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <ConsultingFooter />

      </div>
    </div>
  );
};

// Main Process Component
const Process = () => {
  const { mode } = useMode();

  // Render different version based on mode
  if (mode === 'consulting') {
    return <ConsultingProcess />;
  }
  
  return <DevelopmentProcess />;
};

export default Process;
