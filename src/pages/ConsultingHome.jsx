import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ConsultingFooter from '../components/ConsultingFooter';
import '../components/consulting-standard.css';
import './ConsultingHome.css';
import buildingImg from '../assets/37e6d3a4815a48fb00ce36f0521c1530589212f1.png';
import decoImg from '../assets/3a10550a9fa6f7937092a6d5076422745317030d.png';

const ConsultingHome = () => {
  return (
    <div className="consulting-page">
      <Navbar />

      {/* HERO */}
      <section className="c-hero">
        <h1 className="c-hero-title">
          We advise.<br />
          We transform.<br />
          We <span className="outline">strategize.</span>
        </h1>

        <div className="c-intro">
          <div className="c-intro-text">
            <h2>ADNC Group advises organisations across the public and private sectors.</h2>
            <p className="lede">
              Government bodies and public institutions, industrial groups, established digital businesses, hospitality and retail networks, and the founders of early stage companies.
            </p>
            <p className="maxim">” The sector changes. The discipline does not. “</p>
            <p className="lede">
              We use data driven analysis and the formal methods of decision science to establish what an organisation should do next, on what evidence, and under what conditions that recommendation would change.
            </p>

            <div className="c-cta-row">
              <Link to="/contact" className="c-btn-primary">Request an initial assessment →</Link>
              <Link to="/process" className="c-btn-secondary">Our method →</Link>
            </div>
          </div>

          <div className="c-intro-image">
            <img src={buildingImg} alt="ADNC Group building" />
            <div className="brand">ADNC<br />Group</div>
          </div>
        </div>
      </section>

      {/* MARQUEE 1 */}
      <div className="c-marquee-band">
        <div className="c-marquee-track u-marquee-hover">
          <span>We measure</span><span className="dot"></span>
          <span>We model</span><span className="dot"></span>
          <span>We challenge</span><span className="dot"></span>
          <span>We quantify</span><span className="dot"></span>
          <span>We document</span><span className="dot"></span>
          <span>We recommend</span><span className="dot"></span>
          <span>We remain accountable</span><span className="dot"></span>
          <span>We measure</span><span className="dot"></span>
          <span>We model</span><span className="dot"></span>
          <span>We challenge</span><span className="dot"></span>
          <span>We quantify</span><span className="dot"></span>
          <span>We document</span><span className="dot"></span>
          <span>We recommend</span><span className="dot"></span>
          <span>We remain accountable</span><span className="dot"></span>
        </div>
      </div>

      {/* ONE PARTNER */}
      <section className="c-partner">
        <h2>One partner. <em>Complete clarity.</em></h2>
        <div className="c-partner-grid">
          <div className="c-partner-col">
            <h3>Evidence</h3>
            <p>
              We start with what the organisation already records but cannot see. Data audit and instrumentation, forecasting, operational and market analysis. Where the available data does not support a conclusion we say so, and we design the measurement that would produce it rather than filling the gap with assumption. Every figure we present can be traced back to its source.
            </p>
            <ul>
              <li>- Data audit, quality assessment &amp; instrumentation</li>
              <li>- Forecasting and predictive modelling</li>
              <li>- Market, demand and competitive analysis</li>
              <li>- Performance measurement and KPI frameworks</li>
              <li>- Executive reporting and decision dashboards</li>
            </ul>
          </div>
          <div className="c-partner-col">
            <h3>Decision.</h3>
            <p>
              Then the decision itself. We structure the question, set out the realistic alternatives, model their outcomes and exposures, and bring into the open the assumptions each one depends on. The point of the exercise is that the decision rests on documented evidence rather than on the confidence of whoever spoke last. Our recommendation states in writing the circumstances in which we would revise it.
            </p>
            <ul>
              <li>- Decision structuring and option mapping</li>
              <li>- Scenario modelling and sensitivity analysis</li>
              <li>- Risk quantification and mitigation design</li>
              <li>- Investment appraisal and business cases</li>
              <li>- Independent challenge of existing plans</li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHO WE ADVISE */}
      <section className="c-advise">
        <h2>Who we advise</h2>
        {[
          { n: '1', title: 'Public institutions and government bodies', text: 'Programme appraisal, impact measurement, resource allocation frameworks, digital modernisation planning, and the reporting structures that make performance visible to oversight bodies. Our files are documented to withstand audit.' },
          { n: '2', title: 'Industry and established enterprises', text: 'Operational performance measurement, capacity and investment planning, supply chain analytics, and modernisation programmes scoped to what the organisation can realistically absorb.' },
          { n: '3', title: 'Digital businesses', text: 'Growth allocation, pricing architecture, retention economics, platform investment appraisal, and the operating model needed to scale without giving up margin.' },
          { n: '4', title: 'Hospitality, retail and networks', text: 'Location analysis, demand forecasting, assortment and menu economics, staffing models, and expansion decisions grounded in measurement rather than instinct.' },
          { n: '5', title: 'Founders and early stage companies', text: 'Positioning, market sizing, unit economics, build or buy analysis, fundraising readiness, and the sequencing decisions that determine whether the capital lasts long enough to matter.' },
          { n: '6', title: 'Investors and boards', text: 'Independent due diligence, technology and operational assessment, post investment review, and second opinions on decisions already in motion.' },
        ].map((item) => (
          <div className="c-advise-row" key={item.n}>
            <div className="c-advise-num">{item.n}</div>
            <div className="c-advise-body">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* SERVICES BAND */}
      <div className="c-services-band">
        <h2>Data, decision science and delivery,<br /><span className="outline-line">End to End.</span></h2>
        <Link className="c-view-all" to="/services">View all services →</Link>
      </div>

      {/* SERVICE CARDS + 3D OBJECT */}
      <section className="c-cards-area">
        <div className="c-cards-scatter">

          <div className="c-service-card card-1">
            <div className="pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.5"><path d="M3 20h18M6 20V10M12 20V4M18 20v-7"/></svg>
              Data-driven analysis
            </div>
            <p>Data audit, instrumentation, forecasting and modelling. We turn what an organisation already records into evidence a committee can act on, and we identify what is still not being measured at all. You receive a documented analysis with sourced figures and its limitations stated openly.</p>
            <img className="card-deco" src={decoImg} alt="" />
          </div>

          <div className="c-service-card card-2">
            <div className="pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              Technology and digital advisory
            </div>
            <p>Technology decisions carry consequences out of all proportion to the evidence they are usually taken on. We assess architecture and infrastructure independently, analyse build against buy, evaluate vendors and establish total cost of ownership. We hold no reseller agreements of any kind.</p>
            <img className="card-deco" src={decoImg} alt="" />
          </div>

          <div className="c-service-card card-3">
            <div className="pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.5"><path d="M4 4h16v16H4z"/><path d="M9 9h6v6H9z"/></svg>
              Decision sciences
            </div>
            <p>The formal discipline of choosing well when the information is incomplete. Decision structuring, scenario modelling, sensitivity analysis, risk quantification. These methods were developed for capital intensive industry. We apply them in sectors where they are almost never used.</p>
            <img className="card-deco" src={decoImg} alt="" />
          </div>

          <div className="c-service-card card-4">
            <div className="pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.5"><path d="M8 4h8v4H8zM6 8h12v12H6z"/><path d="M9 12h6M9 16h6"/></svg>
              Strategy and transformation
            </div>
            <p>Once a decision is taken it still has to be sequenced, financed, governed and absorbed by the organisation. Target operating model, roadmap, governance structure, benefits tracking. The output is a phased roadmap with owners, milestones and benefits that can actually be measured.</p>
            <img className="card-deco" src={decoImg} alt="" />
          </div>

          <div className="c-service-card card-5">
            <div className="pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M9 12h6"/></svg>
              Financial and performance advisory
            </div>
            <p>Business plans, financial modelling, investment appraisal, unit economics, operational audit. These are the figures that settle whether an ambition is a plan or a wish. The model we build is documented, transferable to your own teams, and every assumption inside it is made explicit.</p>
            <img className="card-deco" src={decoImg} alt="" />
          </div>

        </div>
      </section>

      {/* MARQUEE 2 */}
      <div className="c-marquee-band skills">
        <div className="c-marquee-track u-marquee-hover">
          <span>Data analysis ✦ &nbsp;&nbsp; Decision science ✦ &nbsp;&nbsp; Forecasting ✦ &nbsp;&nbsp; Risk modelling ✦ &nbsp;&nbsp; Digital strategy ✦ &nbsp;&nbsp; Business intelligence ✦ &nbsp;&nbsp; Financial advisory ✦ &nbsp;&nbsp; Any sector ✦ &nbsp;&nbsp;</span>
          <span>Data analysis ✦ &nbsp;&nbsp; Decision science ✦ &nbsp;&nbsp; Forecasting ✦ &nbsp;&nbsp; Risk modelling ✦ &nbsp;&nbsp; Digital strategy ✦ &nbsp;&nbsp; Business intelligence ✦ &nbsp;&nbsp; Financial advisory ✦ &nbsp;&nbsp; Any sector ✦ &nbsp;&nbsp;</span>
        </div>
      </div>

      {/* PROCESS */}
      <section className="c-process">
        <h2>From an uncertain decision<br />to a defensible one.</h2>
        {[
          { title: 'Frame', text: 'We establish what is being decided, by whom, by when, and what a good outcome would actually look like. A written engagement scope is issued before any work starts. A fair number of engagements resolve at this stage, because the question first asked turns out not to be the one that mattered.' },
          { title: 'Establish the evidence', text: 'Interviews at every relevant level, review of operational and financial documentation, market analysis, and independent verification of the assumptions holding up the existing plan. We record what we verified, what we inferred, and what could not be established at all.' },
          { title: 'Model the alternatives', text: 'Every realistic course of action gets modelled. Expected outcomes, downside exposure, capital and organisational requirements, and the specific conditions under which it would fail.' },
          { title: 'Recommend', text: 'Findings go to the sponsoring body with a clear recommendation, the alternatives we considered, the risks attached to each one, and an explicit statement of what would have to change for our advice to change with it.' },
          { title: 'Accompany', text: 'Where the organisation decides to proceed, we can support execution. Through programme governance, or through our engineering division, under the same named accountability.' },
        ].map((step) => (
          <div className="c-process-row" key={step.title}>
            <h3>{step.title}</h3>
            <div className="c-process-divider"></div>
            <p>{step.text}</p>
          </div>
        ))}
      </section>

      {/* WHY ADNC */}
      <section className="c-why">
        <h2>WHY ADNC</h2>
        <div className="c-why-grid">
          <div className="c-why-card">
            <h3>Independence</h3>
            <p>We hold no reseller agreements and take no vendor commission. Technology recommendations are made on their merits. Where we hold an interest of any kind, we declare it in writing before the engagement begins.</p>
          </div>
          <div className="c-why-card">
            <h3>Traceability</h3>
            <p>Every conclusion can be traced back to documented analysis. We separate what we verified from what we inferred and from what remains unknown, and our files are kept in a form that will withstand external audit.</p>
          </div>
          <div className="c-why-card">
            <h3>Named<br />accountability</h3>
            <p>Each engagement has a named senior lead who stays responsible from scoping through to conclusion, and who is available to your executive or oversight body throughout.</p>
          </div>
          <div className="c-why-card">
            <h3>Advice that<br />can be built</h3>
            <p>The practice sits alongside an engineering division that designs and runs production systems every day. Recommendations that could not survive implementation do not leave this building.</p>
          </div>
        </div>
      </section>

      {/* BUILD CTA */}
      <div className="c-build-cta">
        <h2>Decision made, and nobody can build it?</h2>
        <Link to="/">That is what our engineering division is for. →</Link>
      </div>

      {/* FINAL CTA */}
      <section className="c-final-cta">
        <h2>Need strategic <em>clarity?</em></h2>
        <p>
          <strong>Describe the decision and its context.</strong> You receive an assessment of how we would approach it, the evidence it would take, an indicative scope and timeline, and the team that would be assigned to it. Initial assessments carry no commitment and are treated as confidential.
        </p>
        <Link to="/contact" className="c-btn-primary">Request an initial assessment →</Link>
      </section>

      <ConsultingFooter />
    </div>
  );
};

export default ConsultingHome;