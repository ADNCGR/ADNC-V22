import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConsultingFooter from '../components/ConsultingFooter';
import { useMode } from '../context/ModeContext';
import { useReveal } from '../hooks/useScrollFx';
import './About.css';

/* Figma 22:2754 (Development) and 22:2965 (Consulting) share one layout:
   a 96px headline, an indented lede, then four staggered principles. */

const DEV = {
  title: 'A lab that does not hand over the keys and disappear.',
  lede: [
    'ADNC was founded to be the partner we spent years looking for and never found. A team that will take on an unproven problem, tell you honestly whether it can be solved, build it if it can, and then run it in production instead of handing the risk back to you at launch. Our engineering, infrastructure and support functions are all internal. The people who designed your system are the people who pick up when it fails.',
  ],
  principles: [
    {
      title: 'We prove before we promise',
      body: 'If the hard part is unproven, we prove it first. Quickly, cheaply, and we tell you about the negative results as readily as the positive ones.',
    },
    {
      title: 'We stay after we ship',
      body: 'Delivery is not the finish line. We run what we build, so the incentive to make it solid never leaves the room.',
    },
    {
      title: 'We keep it internal',
      body: 'Engineering, infrastructure and support all sit under one roof, so nothing gets lost between teams that do not talk to each other.',
    },
    {
      title: 'We say it straight',
      body: 'If something cannot be solved, or should not be built the way you imagined it, we tell you before it costs you anything.',
    },
  ],
  ctaGhost: 'Want to know if we are the right lab?',
  ctaSolid: 'Get in touch',
};

const CONS = {
  title: 'Advice that can actually be built.',
  lede: [
    'ADNC Group runs two divisions that feed each other.',
    'The advisory practice uses data driven analysis and decision science to help organisations of any size, in any sector, work out what to do next.',
    'The engineering division designs, builds and operates the systems those decisions tend to require. The arrangement is deliberate.',
    'Advice shaped by operational reality survives contact with implementation, and engineering shaped by rigorous analysis produces systems that serve the organisation rather than merely working.',
  ],
  principles: [
    {
      title: 'Independence',
      body: 'We hold no reseller agreements and take no vendor commission. Technology recommendations are made on their merits. Where we hold an interest of any kind, we declare it in writing before the engagement begins.',
    },
    {
      title: 'Traceability',
      body: 'Every conclusion can be traced back to documented analysis. We separate what we verified from what we inferred and from what remains unknown, and our files are kept in a form that will withstand external audit.',
    },
    {
      title: 'Named accountability',
      body: 'Each engagement has a named senior lead who stays responsible from scoping through to conclusion, and who is available to your executive or oversight body throughout.',
    },
    {
      title: 'Advice that can be built',
      body: 'The practice sits alongside an engineering division that designs and runs production systems every day. Recommendations that could not survive implementation do not leave this building.',
    },
  ],
  ctaGhost: 'Want a second opinion before you commit?',
  ctaSolid: 'Request an initial assessment',
};

const Principle = ({ item, delay }) => (
  <div className="ab-principle reveal" style={{ transitionDelay: `${delay}s` }}>
    <h3>{item.title}</h3>
    <p>{item.body}</p>
  </div>
);

const About = () => {
  const { mode } = useMode();
  const isConsulting = mode === 'consulting';
  const data = isConsulting ? CONS : DEV;

  useReveal([mode]);

  const [a, b, c, d] = data.principles;

  return (
    <div className={`ab-root${isConsulting ? ' ab-root--cons' : ''}`}>
      <Navbar />

      <section className="ab-hero">
        <h1 className="reveal">{data.title}</h1>
      </section>

      <hr className="ab-rule" />

      <section className="ab-intro">
        <div className="ab-intro-copy reveal">
          {data.lede.map((line) => <p key={line}>{line}</p>)}
        </div>
      </section>

      <hr className="ab-rule" />

      <section className="ab-principles">
        <div className="ab-principles-head reveal">
          <span className="ab-principles-word">Principles</span>
          <span className="ab-quote" aria-hidden="true">“</span>
        </div>

        <div className="ab-principles-grid">
          <div className="ab-col">
            <Principle item={a} delay={0} />
            <Principle item={c} delay={0.2} />
          </div>
          <div className="ab-col ab-col--right">
            <Principle item={b} delay={0.1} />
            <Principle item={d} delay={0.3} />
          </div>
        </div>

        <div className="ab-cta reveal">
          <Link to="/contact" className="ab-btn ab-btn--ghost">
            <span className="ab-dot" />
            {data.ctaGhost}
          </Link>
          <Link to="/contact" className="ab-btn ab-btn--solid">
            <span className="ab-dot" />
            {data.ctaSolid}
          </Link>
        </div>
      </section>

      {isConsulting ? <ConsultingFooter /> : <Footer />}
    </div>
  );
};

export default About;
