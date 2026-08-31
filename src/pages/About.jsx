import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConsultingNavbar from '../components/ConsultingNavbar';
import ConsultingTabSwitcher from '../components/ConsultingTabSwitcher';
import ConsultingFooter from '../components/ConsultingFooter';
import { useMode } from '../context/ModeContext';
import './About.css';

// Development Version (Original)
const DevelopmentAbout = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="about-page">
      <Navbar />

      <main className="wrap">

        <section className="hero">
          <h1>A lab that does not hand over the keys and disappear.</h1>
        </section>

        <hr className="divider" />

        <section className="intro">
          <p>ADNC was founded to be the partner we spent years looking for and never found. A team that will take on an unproven problem, tell you honestly whether it can be solved, build it if it can, and then run it in production instead of handing the risk back to you at launch. Our engineering, infrastructure and support functions are all internal. The people who designed your system are the people who pick up when it fails.</p>
        </section>

        <hr className="divider" />

        <section className="principles">
          <div className="principles-head">
            <h2>Principles</h2>
            <span className="quote">&ldquo;</span>
          </div>

          <div className="principle-grid">
            <div className="principle-item">
              <h3>We prove before we promise</h3>
              <p>If the hard part is unproven, we prove it first. Quickly, cheaply, and we tell you about the negative results as readily as the positive ones.</p>
            </div>
            <div className="principle-item">
              <h3>We stay after we ship</h3>
              <p>Delivery isn&rsquo;t the finish line. We run what we build, so the incentive to make it solid never leaves the room.</p>
            </div>
            <div className="principle-item">
              <h3>We keep it internal</h3>
              <p>Engineering, infrastructure and support all sit under one roof, so nothing gets lost between teams that don&rsquo;t talk to each other.</p>
            </div>
            <div className="principle-item">
              <h3>We say it straight</h3>
              <p>If something can&rsquo;t be solved, or shouldn&rsquo;t be built the way you imagined it, we tell you before it costs you anything.</p>
            </div>
          </div>
        </section>

        <div className="cta-row">
          <span className="btn-outline">Want to know if we are the right lab?</span>
          <Link to="/contact" className="btn-solid"><span className="dot"></span> Get in touch</Link>
        </div>

        <hr className="divider" />

        <Footer />
      </main>
    </div>
  );
};

// Consulting Version (New Design - Standard components)
const ConsultingAbout = () => {
  return (
    <div className="consulting-about-page">

      <ConsultingNavbar />
      <ConsultingTabSwitcher />

      {/* PAGE CONTENT (standard wrapper) */}
      <div className="ca-page-content-wrapper">
        <div className="ca-main-content">
          <div className="ca-content-inner">
            <div className="ca-content-block">

              <h1 className="ca-hero-title">Advice that can actually be built.</h1>

              <div className="ca-description-block">
                <p className="ca-description-text">ADNC Group runs two divisions that feed each other.<br/>
The advisory practice uses data driven analysis and decision science to help organisations of any size, in any sector, work out what to do next.<br/>
The engineering division designs, builds and operates the systems those decisions tend to require. The arrangement is deliberate.<br/>
Advice shaped by operational reality survives contact with implementation, and engineering shaped by rigorous analysis produces systems that serve the organisation rather than merely working.</p>
              </div>

              <div className="ca-principles-section">
                <div className="ca-principles-header">
                  <span className="ca-principles-title">Principles</span><span className="ca-principles-quote">&ldquo;</span>
                </div>

                <div className="ca-principles-grid">
                  <div className="ca-principle-card ca-card-1">
                    <h3>Independence</h3>
                    <p>We hold no reseller agreements and take no vendor commission. Technology recommendations are made on their merits. Where we hold an interest of any kind, we declare it in writing before the engagement begins.</p>
                  </div>
                  <div className="ca-principle-card ca-card-2">
                    <h3>Traceability</h3>
                    <p>Every conclusion can be traced back to documented analysis. We separate what we verified from what we inferred and from what remains unknown, and our files are kept in a form that will withstand external audit.</p>
                  </div>
                  <div className="ca-principle-card ca-card-3">
                    <h3>Named accountability</h3>
                    <p>Each engagement has a named senior lead who stays responsible from scoping through to conclusion, and who is available to your executive or oversight body throughout.</p>
                  </div>
                  <div className="ca-principle-card ca-card-4">
                    <h3>Advice that can be built</h3>
                    <p>The practice sits alongside an engineering division that designs and runs production systems every day. Recommendations that could not survive implementation do not leave this building.</p>
                  </div>
                </div>

                <div className="ca-cta-row">
                  <a href="#" className="ca-cta-btn ca-cta-btn-outline">
                    <span>Want a second opinion before you commit?</span>
                    <span className="ca-dot"></span>
                    <span className="ca-line"></span>
                  </a>
                  <Link to="/contact" className="ca-cta-btn ca-cta-btn-filled">
                    <span>Request an initial assessment</span>
                    <span className="ca-dot"></span>
                    <span className="ca-line"></span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <ConsultingFooter />
    </div>
  );
};

// Main About Component
const About = () => {
  const { mode } = useMode();

  if (mode === 'consulting') {
    return <ConsultingAbout />;
  }

  return <DevelopmentAbout />;
};

export default About;
