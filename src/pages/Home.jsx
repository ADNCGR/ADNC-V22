import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConsultingHome from './ConsultingHome';
import { useMode } from '../context/ModeContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { mode } = useMode();
  const container = useRef();
  const [activeTab, setActiveTab] = useState(0);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const t = document.getElementById(id);
    if (t) {
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    }
  };

  useGSAP(() => {
    if (mode === 'consulting') return;
    gsap.set('.hero-title .line span', { y: '110%' });
    gsap.set('.hero-squares', { opacity: 0 });
    gsap.set('.hero-squares span', { scale: 0 });
    gsap.set('#heroDesc', { opacity: 0 });
    gsap.set('#heroCtas', { opacity: 0 });
    gsap.set('.cap', { opacity: 0, scale: .7 });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to('.hero-title .line span', { y: '0%', duration: 1.1, stagger: .12 })
      .to('.hero-squares', { opacity: 1, duration: .3 }, '-=.6')
      .to('.hero-squares span', { scale: 1, duration: .5, stagger: { amount: .6, from: 'random' }, ease: 'back.out(2)' }, '<')
      .to('#heroDesc', { opacity: 1, duration: .9 }, '-=.5')
      .to('#heroCtas', { opacity: 1, duration: .9 }, '-=.7');

    const rotWords = ['scale.', 'deploy.', 'engineer.'];
    let ri = 0;
    const cycleWord = () => {
      const rotEl = document.getElementById('rotator');
      if (!rotEl) return;
      gsap.to(rotEl, {
        duration: .5, ease: 'power3.in', y: -24, opacity: 0, onComplete: () => {
          ri = (ri + 1) % rotWords.length;
          rotEl.textContent = rotWords[ri];
          gsap.fromTo(rotEl, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' });
        }
      });
    };
    const interval = setInterval(cycleWord, 2600);

    const onScroll = () => {
      const pill = document.getElementById('navPill');
      if (pill) {
        if (window.scrollY > 40) pill.classList.add('scrolled');
        else pill.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll);

    gsap.utils.toArray('.cap').forEach((cap, i) => {
      ScrollTrigger.create({
        trigger: '.partner-stage', start: 'top 75%',
        onEnter: () => gsap.to(cap, { opacity: 1, scale: 1, duration: .8, delay: i * .08, ease: 'back.out(1.7)' })
      });
    });
    
    ScrollTrigger.create({
      trigger: '.partner-stage', start: 'top 75%',
      onEnter: () => gsap.from('.partner-img', { opacity: 0, scale: .85, duration: 1, ease: 'power3.out' })
    });

    ScrollTrigger.create({
      trigger: '#stackInner', start: 'top 70%',
      onEnter: () => {
        const el = document.getElementById('stackInner');
        if (el) el.classList.add('reveal');
      }
    });

    gsap.utils.toArray('.svc-row').forEach(row => {
      gsap.from(row, { opacity: 0, y: 26, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 88%' } });
    });

    ScrollTrigger.create({
      trigger: '#stepsFan', start: 'top 75%',
      onEnter: () => {
        const el = document.getElementById('stepsFan');
        if (el) el.classList.add('spread');
      }
    });

    gsap.from('.process-head', { opacity: 0, y: 20, duration: 1, scrollTrigger: { trigger: '.process-head', start: 'top 85%' } });
    gsap.from('.consult-card', { opacity: 0, y: 20, duration: 1, scrollTrigger: { trigger: '.consult-card', start: 'top 90%' } });
    gsap.from('.final-cta h2, .final-cta p, .final-cta a', { opacity: 0, y: 24, stagger: .1, duration: .9, scrollTrigger: { trigger: '.final-cta', start: 'top 80%' } });

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', onScroll);
    };
  }, { scope: container });

  const sqPositions = [
    { x: 70, y: 30 }, { x: 180, y: 70 }, { x: 290, y: 30 },
    { x: 120, y: 135 }, { x: 235, y: 135 },
    { x: 70, y: 200 }, { x: 180, y: 210 }, { x: 280, y: 205 }, { x: 345, y: 180 },
    { x: 125, y: 280 }, { x: 235, y: 280 }, { x: 300, y: 285 },
    { x: 35, y: 300 }, { x: 140, y: 340 }, { x: 250, y: 350 }, { x: 345, y: 320 }
  ];

  const words = Array(10).fill('ADNC');
  const kws = ['✦ Applied research', '✦ Feasibility', '✦ Prototyping', '✦ Product design', '✦ Native mobile', '✦ Real-time', '✦ Applied AI', '✦ Production & scale'];

  if (mode === 'consulting') {
    return <ConsultingHome />;
  }

  return (
    <div ref={container}>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <h1 className="hero-title">
            <span className="line"><span>We build.</span></span>
            <span className="line"><span>We operate.</span></span>
            <span className="line"><span>We <span className="rotator-wrap"><span className="rotator" id="rotator">deploy.</span></span></span></span>
          </h1>
          <p className="hero-desc" id="heroDesc">
            <b>ADNC</b><span className="spacer"></span>
            is not a software company. We are a research and engineering lab.
            Clients come to us with the work nobody else would take on: the system that
            has no precedent, the constraint everyone said was unreachable.
            We find out whether it can be done, we build it if it can, and then we
            run it in production for as long as you need us there.
            Every engagement starts with a written scope and a senior engineer whose
            name stays on it until the last day.
          </p>
          <div className="hero-ctas" id="heroCtas">
            <a href="#contact" className="btn-pill" onClick={(e) => handleScrollTo(e, 'contact')}>Bring us the hard problem →</a>
            <a href="#process" className="btn-pill" style={{ background: 'transparent', color: '#fff', border: '0.5px solid #fff' }} onClick={(e) => handleScrollTo(e, 'process')}>
              <span style={{ display: 'none' }}></span>How we work
            </a>
          </div>
        </div>
        <div className="hero-squares" id="heroSquares">
          {sqPositions.map((p, i) => (
            <span key={i} style={{ left: p.x + 'px', top: p.y + 'px' }}></span>
          ))}
        </div>
      </section>

      {/* MARQUEE 1 */}
      <div className="marquee-section">
        <div className="marquee-track" id="marquee1">
          {words.map((w, i) => <span key={`a-${i}`}>{w}</span>)}
          {words.map((w, i) => <span key={`b-${i}`}>{w}</span>)}
        </div>
      </div>

      {/* CAPSULES */}
      <section className="partner">
        <div className="partner-stage">
          <div className="partner-img">
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" alt="Engineering site" />
          </div>
          <div className="cap c1"><span className="dot"></span>We research</div>
          <div className="cap c2"><span className="dot"></span>We prototype</div>
          <div className="cap c3"><span className="dot"></span>We prove it</div>
          <div className="cap c4"><span className="dot"></span>We operate</div>
          <div className="cap c5"><span className="dot"></span>We engineer</div>
          <div className="cap c6"><span className="dot"></span>We deploy</div>
          <div className="cap c7"><span className="dot"></span>We stay accountable</div>
        </div>
      </section>

      {/* STACKED CARDS */}
      <section className="stack" id="stackSection">
        <div className="stack-inner" id="stackInner">
          <div className="paper back">
            <h3>Make it real.</h3>
            <p>An idea becomes real the day a stranger uses it at three in the morning and nothing breaks. We engineer it, we deploy it, we instrument it, and we take the on-call rotation ourselves. The engineers who designed your system are the ones who answer when it fails. In our experience that is the only arrangement which reliably produces systems that do not.</p>
            <div className="tags">
              <span>Web platforms, native iOS & Android</span>
              <span>Distributed & real-time backends</span>
              <span>Production infrastructure & CI/CD</span>
              <span>Observability, incident response & on-call</span>
              <span>Documented handover, or none if we stay</span>
            </div>
          </div>
          <div className="paper front">
            <h3>Invent.</h3>
            <p>Most teams build what you describe. We get called in when nobody can describe it yet. So we start at the version everyone calls impossible and work backwards from there, separating what is genuinely unknown from what only looks that way. You get that analysis in writing before we commit a single line of production code.</p>
            <div className="tags">
              <span>Concept framing & feasibility analysis</span>
              <span>Applied research & technical spikes</span>
              <span>Algorithm and system design</span>
              <span>Rapid prototyping in days</span>
              <span>Written feasibility report & cost envelope</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <div className="wrap">
          <div className="services-head">
            <h2>Research and engineering<br />under one roof</h2>
            <div className="view-btn"><a href="/services">View all services</a></div>
          </div>
        </div>

        <div className="svc-row" id="row1">
          <div className="svc-header">
            <div className="svc-title">Research & feasibility</div>
            <span className="svc-num">01</span>
          </div>
          <div className="svc-body">
            <p className="svc-desc">Before anyone commits a budget, we establish whether the difficult part is possible and what it costs to get there. Technical spikes, applied AI experimentation, algorithm design, a working prototype inside a few weeks. The phase ends with a written report: what we proved, what we could not, and what we would advise against attempting at all. Some engagements stop here, on our recommendation.</p>
          </div>
        </div>

        <div className="svc-row" id="row2">
          <div className="svc-header">
            <div className="svc-title">Engineering & operations</div>
            <span className="svc-num">02</span>
          </div>
          <div className="svc-body">
            <p className="svc-desc">Then we build the real thing and keep it standing. All of it deployed, hardened, secured and operated by the same people who designed the architecture, not handed off to a stranger once the hard part is over. Security, accessibility and data protection get resolved in the architecture, not bolted on before launch.</p>
          </div>
        </div>

        <div className="marquee2-section">
          <div className="marquee2-track" id="marquee2">
            {kws.map((k, i) => <span key={`a-${i}`}>{k}</span>)}
            {kws.map((k, i) => <span key={`b-${i}`}>{k}</span>)}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process" id="process">
        <div className="wrap">
          <div className="process-head">
            <h2>From an <span className="pill-word">unproven idea</span> to a <span className="pill-word">system</span> in production.</h2>
          </div>

          <div className="steps" id="stepsFan">
            <div className="step-card">
              <div className="step-title">Frame</div>
              <span className="step-num">1</span>
              <p className="step-desc">We establish what is actually being asked, which constraints are real and which are only assumed, and what success would look like when it proves out.</p>
            </div>
            <div className="step-card">
              <div className="step-title">Prove</div>
              <span className="step-num">2</span>
              <p className="step-desc">The step most providers skip. We go after the hardest unknown first, quickly and cheaply, and we report the result honestly whichever way it goes.</p>
            </div>
            <div className="step-card">
              <div className="step-title">Build</div>
              <span className="step-num">3</span>
              <p className="step-desc">Design and engineering run as one loop. Working software in a real environment, every week. Progress gets demonstrated rather than reported.</p>
            </div>
            <div className="step-card">
              <div className="step-title">Operate</div>
              <span className="step-num">4</span>
              <p className="step-desc">Deployment, scaling, monitoring, incident response. Launch is where the engagement starts, not where it ends.</p>
            </div>
          </div>
        </div>

        <div className="consult-card">
          <div>
            <h3>Not sure the idea is the right one yet?</h3>
            <p>Our advisory practice can tell you before you build it.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta" id="contact">
        <div className="wrap">
          <h2>Got something<br /><b>nobody will take on?</b></h2>
          <p>Describe the problem rather than the specification. You get back a senior technical opinion, an honest read on what is still unproven, an indicative scope, and the names of the engineers who would do the work. We answer within one business day, and we say no when we should.</p>
          <a href="#contact" className="btn-pill" onClick={(e) => handleScrollTo(e, 'contact')}>Bring us the hard problem</a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
