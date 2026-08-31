import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConsultingNavbar from '../components/ConsultingNavbar';
import ConsultingTabSwitcher from '../components/ConsultingTabSwitcher';
import ConsultingFooter from '../components/ConsultingFooter';
import { useMode } from '../context/ModeContext';
import './Services.css';

// Development Version (Original)
const DevelopmentServices = () => {
  const container = useRef();
  const [activeTab, setActiveTab] = useState(0);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const t = document.getElementById(id);
    if (t) {
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const navHolder = document.getElementById('navHolder');
    if (navHolder) navHolder.classList.add('ready');

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: .18, rootMargin: '0px 0px -60px 0px' });
    
    const reveals = container.current.querySelectorAll('.reveal');
    reveals.forEach(el => io.observe(el));

    const secs = ['services', 'process', 'about', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
    const navLinks = container.current.querySelectorAll('.nav-links a');
    const nio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navLinks.forEach(a => {
            const href = a.getAttribute('href');
            if (href && href.includes(id)) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
          });
        }
      });
    }, { threshold: .4 });
    secs.forEach(s => nio.observe(s));

    return () => {
      io.disconnect();
      nio.disconnect();
    };
  }, []);

  return (
    <div ref={container} id="top">
      <Navbar />

      <header className="hero">
        <div className="hero-image">
          <div className="hero-img-placeholder" aria-label="Isometric cityscape illustration"></div>
          <div className="hero-text">
            <div className="hero-text-inner">
              <div className="hero-inner">
                <h1>A lab, not a <span className="factory">factory</span> .</h1>
                <div className="hero-line"></div>
                <p className="hero-body">
                  A factory takes a specification and returns a build.<br /><br />
                  A lab takes a question and returns something that did not exist before, along with an honest account of what it cost to find out.<br /><br />
                  <span className="claim">ADNC is built as a lab.</span><br /><br />
                  Research first, engineering second, operations for as long as you need us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============ TERMINALS ============ */}
      <section id="process">
        <div className="wrap">
          <div className="terminals reveal" id="terminals">
            <div className="term term-input">
              <div className="term-head"># INPUT: Research & Innovation</div>
              <ul className="term-list">
                <li style={{ '--i': 0 }}>[01]: Idea excavation & concept framing</li>
                <li style={{ '--i': 1 }}>[02]: Applied research & technical spikes</li>
                <li style={{ '--i': 2 }}>[03]: AI / ML experimentation</li>
                <li style={{ '--i': 3 }}>[04]: Algorithm & system design</li>
                <li style={{ '--i': 4 }}>[05]: Rapid prototyping</li>
              </ul>
              <button className="term-btn">Run <span>↲</span></button>
            </div>
            <div className="term term-output">
              <div className="term-head"># OUTPUT: Engineering & Production</div>
              <ul className="term-list">
                <li style={{ '--i': 0 }}>[01]: Complex web platforms (React, Next, TanStack)</li>
                <li style={{ '--i': 1 }}>[02]: Native iOS (Swift, SwiftUI) & Android (Kotlin, Compose)</li>
                <li style={{ '--i': 2 }}>[03]: Distributed & real-time backends</li>
                <li style={{ '--i': 3 }}>[04]: Deployment, scaling & observability</li>
                <li style={{ '--i': 4 }}>[05]: Security, incident response & on-call</li>
              </ul>
              <button className="term-btn"><span>↲</span> Source</button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHAT WE TAKE ON ============ */}
      <section>
        <div className="wrap">
          <div className="take-on reveal" id="takeOn">
            <div className="take-panel">
              <span className="take-watermark">[PASS]</span>
              <h3># What we take on</h3>
              <ul>
                <li>[PASS]: Systems with no precedent.</li>
                <li>[PASS]: Constraints the market has decided are unreachable.</li>
                <li>[PASS]: Problems sitting between two fields that nobody has connected.</li>
                <li>[PASS]: Projects other teams have already declared unsalvageable.</li>
              </ul>
            </div>
            <div className="rejected-tab" title="What we don't take on"><span>[REJECTED]</span></div>
          </div>
        </div>
      </section>

      {/* ============ SERVICE GRID ============ */}
      <section id="services">
        <div className="wrap">
          <div className="service-grid reveal" id="serviceGrid">
            <div className="service-cell">
              <span className="idx">01</span>
              <h4>Feasibility<br />engagement</h4>
              <p>A short, paid sprint to find out whether the idea survives contact with reality — before you commit the budget.</p>
            </div>
            <div className="service-cell">
              <span className="idx">02</span>
              <h4>Build<br />with us</h4>
              <p>You hold the vision. We bring the senior team and take it to production.</p>
            </div>
            <div className="service-cell">
              <span className="idx">03</span>
              <h4>Build and<br />operate</h4>
              <p>We design it, build it and run it. One team, one accountability, no handover.</p>
            </div>
            <div className="service-cell">
              <span className="idx">04</span>
              <h4>Recover and<br />rebuild</h4>
              <p>A stalled or broken project, inherited without judgment, stabilized, and shipped.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <a href="#contact" className="cta-link reveal" id="ctaLink" onClick={(e) => handleScrollTo(e, 'contact')}>
            <span className="arrow l">→</span>
            <span>Discuss your project</span>
            <span className="arrow r">→</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Consulting Version (New)
const ConsultingServices = () => {
  const { mode } = useMode();
  const [activeEquation, setActiveEquation] = useState(1);

  const equations = [
    {
      left: 'text text text',
      middle: 'Gut Feeling / Intuition',
      right: 'text text text',
      ghost: true
    },
    {
      left: 'Variable Sector',
      middle: 'Fixed Data Methodology',
      right: 'Proven Decision',
      ghost: false
    },
    {
      left: 'text text text',
      middle: 'Market Hype',
      right: 'text text tex',
      ghost: true
    }
  ];

  const cycleEquation = (direction) => {
    const total = equations.length;
    const next = (activeEquation + direction + total) % total;
    setActiveEquation(next);
  };

  return (
    <div className="consulting-services-page">
      <ConsultingNavbar />
      <ConsultingTabSwitcher />

      {/* HERO */}
      <section className="hero">
        <h1><span className="ghost">Any</span> sector.<br />The <span className="ghost">same</span> discipline.</h1>
        <p>A public authority weighing a modernisation programme and a restaurant group weighing a fourth site are facing the same problem in different clothing. An irreversible commitment, made on incomplete information, with competing opinions inside the organisation. Decision science exists for exactly this. We bring it to organisations that have rarely had access to it.</p>
      </section>

      {/* EQUATION PICKER */}
      <div className="equation-wrap">
        <div className="equation">
          <div className="eq-rows">
            {equations.map((eq, index) => (
              <div 
                key={index} 
                className={`eq-row ${index === activeEquation ? 'active' : 'ghost'}`}
              >
                {eq.ghost ? (
                  <>
                    <span className="eq-slot">{eq.left}</span>
                    <span className="eq-slot mid">{eq.middle}</span>
                    <span className="eq-slot">{eq.right}</span>
                  </>
                ) : (
                  <>
                    <div className="eq-tag">{eq.left}</div>
                    <span className="eq-op">&times;</span>
                    <div className="eq-tag" style={{ fontSize: '26px' }}>{eq.middle}</div>
                    <span className="eq-op">=</span>
                    <div className="eq-tag black">
                      <svg viewBox="0 0 22 18" fill="none">
                        <path d="M1 9l7 7L21 1" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {eq.right}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="eq-control">
            <span className="ball"></span>
            <button className="chev" onClick={() => cycleEquation(-1)} aria-label="Previous">
              <svg viewBox="0 0 12 12" fill="none">
                <path d="M2 8l4-4 4 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="chev" onClick={() => cycleEquation(1)} aria-label="Next">
              <svg viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="ball"></span>
          </div>
        </div>
      </div>

      {/* PRACTICE AREAS */}
      <section className="areas">
        <div className="area">
          <h2>Data <b>&amp;</b> Decision Sciences</h2>
          <ul>
            <li>-&nbsp; Data audit &amp; instrumentation</li>
            <li>-&nbsp; Forecasting &amp; predictive modelling</li>
            <li>-&nbsp; Decision structuring &amp; scenario modelling</li>
            <li>-&nbsp; Risk quantification &amp; sensitivity analysis</li>
            <li>-&nbsp; KPI frameworks &amp; executive reporting</li>
          </ul>
        </div>
        <div className="area">
          <h2>Strategy, Technology <b>&amp;</b> Finance</h2>
          <ul>
            <li>-&nbsp; Digital strategy &amp; transformation roadmaps</li>
            <li>-&nbsp; Independent technology &amp; architecture audit</li>
            <li>-&nbsp; Cloud &amp; infrastructure planning</li>
            <li>-&nbsp; Business plans &amp; financial modelling</li>
            <li>-&nbsp; Investment appraisal &amp; operational audits</li>
          </ul>
        </div>
      </section>

      {/* CARDS */}
      <section className="cards">
        <div className="card">
          <div className="pin">
            <svg viewBox="0 0 26 26">
              <circle cx="9" cy="9" r="8" fill="#555"/>
              <circle cx="15" cy="15" r="8" fill="#222"/>
            </svg>
          </div>
          <h3>Single decision assessment</h3>
          <p>A fixed scope engagement on one defined decision, ending in a written recommendation to the sponsoring body.</p>
        </div>
        <div className="card">
          <div className="pin">
            <svg viewBox="0 0 26 26">
              <circle cx="9" cy="9" r="8" fill="#555"/>
              <circle cx="15" cy="15" r="8" fill="#222"/>
            </svg>
          </div>
          <h3>Advisory and delivery</h3>
          <p>Where implementation follows, the organisation that gave the advice stays accountable for delivering it.</p>
        </div>
        <div className="card">
          <div className="pin">
            <svg viewBox="0 0 26 26">
              <circle cx="9" cy="9" r="8" fill="#555"/>
              <circle cx="15" cy="15" r="8" fill="#222"/>
            </svg>
          </div>
          <h3>Advisory retainer</h3>
          <p>Continuous access to the practice for organisations working through a sequence of related decisions.</p>
        </div>
      </section>

      {/* CTA */}
      <div className="cta">
        <button className="cta-btn">
          Discuss your situation
          <svg viewBox="0 0 15 17" fill="none">
            <path d="M1 1l13 7.5L1 16" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* FOOTER */}
      <ConsultingFooter />
    </div>
  );
};

// Main Services Component
const Services = () => {
  const { mode } = useMode();

  // Render different version based on mode
  if (mode === 'consulting') {
    return <ConsultingServices />;
  }
  
  return <DevelopmentServices />;
};

export default Services;
