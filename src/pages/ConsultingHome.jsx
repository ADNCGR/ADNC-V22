import React from 'react';
import { Link } from 'react-router-dom';
import ConsultingNavbar from '../components/ConsultingNavbar';
import ConsultingTabSwitcher from '../components/ConsultingTabSwitcher';
import ConsultingFooter from '../components/ConsultingFooter';
import './ConsultingHome.css';

const ConsultingHome = () => {
  return (
    <div className="consulting-page">
      <ConsultingNavbar />
      <ConsultingTabSwitcher />

      {/* HERO */}
      <section className="c-hero">
        <h1>We advise.<br />We transform.<br />We <span className="outline">strategize.</span></h1>

        <div className="c-intro">
          <div className="c-intro-text">
            <h2>ADNC Group advises organisations across the public and private sectors.</h2>
            <p className="lede">Government bodies and public institutions, industrial groups, established digital businesses, hospitality and retail networks, and the founders of early stage companies.</p>
            <p className="maxim">"The sector changes. The discipline does not."</p>
            <p className="lede">We use data driven analysis and the formal methods of decision science to establish what an organisation should do next, on what evidence, and under what conditions that recommendation would change.</p>
            <div className="c-cta-row">
              <Link to="/contact" className="c-btn-primary">Request an initial assessment <span className="arrow">→</span></Link>
              <Link to="/process" className="c-btn-secondary">Our method <span className="arrow">→</span></Link>
            </div>
          </div>
          <div className="c-intro-image">
            <div className="brand">ADNC<br />Group</div>
          </div>
        </div>
      </section>

      {/* MARQUEE 1 */}
      <div className="c-marquee-band">
        <div className="c-marquee-track">
          <span>We measure</span><span className="dot"></span>
          <span>We model</span><span class="dot"></span>
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
            <p>We start with what the organisation already records but cannot see. Data audit and instrumentation, forecasting, operational and market analysis. Where the available data does not support a conclusion we say so, and we design the measurement that would produce it rather than filling the gap with assumption. Every figure we present can be traced back to its source.</p>
            <ul>
              <li>• Data audit, quality assessment &amp; instrumentation</li>
              <li>• Forecasting and predictive modelling</li>
              <li>• Market, demand and competitive analysis</li>
              <li>• Performance measurement and KPI frameworks</li>
              <li>• Executive reporting and decision dashboards</li>
            </ul>
          </div>
          <div className="c-partner-col">
            <h3>Decision.</h3>
            <p>Then the decision itself. We structure the question, set out the realistic alternatives, model their outcomes and exposures, and bring into the open the assumptions each one depends on. The point of the exercise is that the decision rests on documented evidence rather than on the confidence of whoever spoke last. Our recommendation states in writing the circumstances in which we would revise it.</p>
            <ul>
              <li>• Decision structuring and option mapping</li>
              <li>• Scenario modelling and sensitivity analysis</li>
              <li>• Risk quantification and mitigation design</li>
              <li>• Investment appraisal and business cases</li>
              <li>• Independent challenge of existing plans</li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHO WE ADVISE */}
      <section className="c-advise">
        <h2>Who we advise</h2>

        <div className="c-advise-row">
          <div className="c-advise-num">1</div>
          <div className="c-advise-body">
            <h3>Public institutions and government bodies</h3>
            <p>Programme appraisal, impact measurement, resource allocation frameworks, digital modernisation planning, and the reporting structures that make performance visible to oversight bodies. Our files are documented to withstand audit.</p>
          </div>
        </div>
        <div className="c-advise-row">
          <div className="c-advise-num">2</div>
          <div className="c-advise-body">
            <h3>Industry and established enterprises</h3>
            <p>Operational performance measurement, capacity and investment planning, supply chain analytics, and modernisation programmes scoped to what the organisation can realistically absorb.</p>
          </div>
        </div>
        <div className="c-advise-row">
          <div className="c-advise-num">3</div>
          <div className="c-advise-body">
            <h3>Digital businesses</h3>
            <p>Growth allocation, pricing architecture, retention economics, platform investment appraisal, and the operating model needed to scale without giving up margin.</p>
          </div>
        </div>
        <div className="c-advise-row">
          <div className="c-advise-num">4</div>
          <div className="c-advise-body">
            <h3>Hospitality, retail and networks</h3>
            <p>Location analysis, demand forecasting, assortment and menu economics, staffing models, and expansion decisions grounded in measurement rather than instinct.</p>
          </div>
        </div>
        <div className="c-advise-row">
          <div className="c-advise-num">5</div>
          <div className="c-advise-body">
            <h3>Founders and early stage companies</h3>
            <p>Positioning, market sizing, unit economics, build or buy analysis, fundraising readiness, and the sequencing decisions that determine whether the capital lasts long enough to matter.</p>
          </div>
        </div>
        <div className="c-advise-row">
          <div className="c-advise-num">6</div>
          <div className="c-advise-body">
            <h3>Investors and boards</h3>
            <p>Independent due diligence, technology and operational assessment, post investment review, and second opinions on decisions already in motion.</p>
          </div>
        </div>
      </section>

      {/* SERVICES BAND */}
      <div className="c-services-band" id="services">
        <h2>Data, decision science and delivery, End to End.</h2>
        <Link className="c-view-all" to="/services">View all services →</Link>
      </div>

      {/* SERVICE CARDS */}
      <section className="c-cards-area">
        <div className="c-cards-grid">
          <div className="c-service-card" style={{ transform: 'rotate(2deg)' }}>
            <div className="pill">
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.5"><path d="M3 20h18M6 20V10M12 20V4M18 20v-7"/></svg>
              Data-driven analysis
            </div>
            <p>Data audit, instrumentation, forecasting and modelling. We turn what an organisation already records into evidence a committee can act on, and we identify what is still not being measured at all. You receive a documented analysis with sourced figures and its limitations stated openly.</p>
          </div>
          <div className="c-service-card" style={{ transform: 'rotate(-1.5deg)' }}>
            <div className="pill">
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              Technology and digital advisory
            </div>
            <p>Technology decisions carry consequences out of all proportion to the evidence they are usually taken on. We assess architecture and infrastructure independently, analyse build against buy, evaluate vendors and establish total cost of ownership. We hold no reseller agreements of any kind. You receive an independent assessment and a reasoned recommendation.</p>
          </div>
          <div className="c-service-card" style={{ transform: 'rotate(1deg)' }}>
            <div className="pill">
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M9 12h6"/></svg>
              Financial and performance advisory
            </div>
            <p>Business plans, financial modelling, investment appraisal, unit economics, operational audit. These are the figures that settle whether an ambition is a plan or a wish. The model we build is documented, transferable to your own teams, and every assumption inside it is made explicit.</p>
          </div>
          <div className="c-service-card" style={{ transform: 'rotate(-2deg)' }}>
            <div className="pill">
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.5"><path d="M4 4h16v16H4z"/><path d="M9 9h6v6H9z"/></svg>
              Decision sciences
            </div>
            <p>The formal discipline of choosing well when the information is incomplete. Decision structuring, scenario modelling, sensitivity analysis, risk quantification. These methods were developed for capital intensive industry. We apply them in sectors where they are almost never used. What you get is a decision file setting out each modelled alternative and the conditions under which it fails.</p>
          </div>
          <div className="c-service-card" style={{ transform: 'rotate(1.5deg)' }}>
            <div className="pill">
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.5"><path d="M8 4h8v4H8zM6 8h12v12H6z"/><path d="M9 12h6M9 16h6"/></svg>
              Strategy and transformation
            </div>
            <p>Once a decision is taken it still has to be sequenced, financed, governed and absorbed by the organisation. Target operating model, roadmap, governance structure, benefits tracking. Throughout, we keep a firm line between what has to change now and what only appears urgent. The output is a phased roadmap with owners, milestones and benefits that can actually be measured.</p>
          </div>
        </div>
      </section>

      {/* MARQUEE 2 */}
      <div className="c-marquee-band">
        <div className="c-marquee-track">
          <span>Data analysis ✦ Decision science ✦ Forecasting ✦ Risk modelling ✦ Digital strategy ✦ Business intelligence ✦ Financial advisory ✦ Any sector ✦</span>
          <span>Data analysis ✦ Decision science ✦ Forecasting ✦ Risk modelling ✦ Digital strategy ✦ Business intelligence ✦ Financial advisory ✦ Any sector ✦</span>
        </div>
      </div>

      {/* PROCESS */}
      <section className="c-process" id="process">
        <h2>From an uncertain decision<br />to a defensible one.</h2>

        <div className="c-process-row">
          <h3>Frame</h3>
          <div className="c-process-divider"></div>
          <p>We establish what is being decided, by whom, by when, and what a good outcome would actually look like. A written engagement scope is issued before any work starts. A fair number of engagements resolve at this stage, because the question first asked turns out not to be the one that mattered.</p>
        </div>
        <div className="c-process-row">
          <h3>Establish the evidence</h3>
          <div className="c-process-divider"></div>
          <p>Interviews at every relevant level, review of operational and financial documentation, market analysis, and independent verification of the assumptions holding up the existing plan. We record what we verified, what we inferred, and what could not be established at all.</p>
        </div>
        <div className="c-process-row">
          <h3>Model the alternatives</h3>
          <div className="c-process-divider"></div>
          <p>Every realistic course of action gets modelled. Expected outcomes, downside exposure, capital and organisational requirements, and the specific conditions under which it would fail.</p>
        </div>
        <div className="c-process-row">
          <h3>Recommend</h3>
          <div className="c-process-divider"></div>
          <p>Findings go to the sponsoring body with a clear recommendation, the alternatives we considered, the risks attached to each one, and an explicit statement of what would have to change for our advice to change with it.</p>
        </div>
        <div className="c-process-row">
          <h3>Accompany</h3>
          <div className="c-process-divider"></div>
          <p>Where the organisation decides to proceed, we can support execution. Through programme governance, or through our engineering division, under the same named accountability.</p>
        </div>
      </section>

      {/* WHY ADNC */}
      <section className="c-why" id="why">
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
            <h3>Named accountability</h3>
            <p>Each engagement has a named senior lead who stays responsible from scoping through to conclusion, and who is available to your executive or oversight body throughout.</p>
          </div>
          <div className="c-why-card">
            <h3>Advice that can be built</h3>
            <p>The practice sits alongside an engineering division that designs and runs production systems every day. Recommendations that could not survive implementation do not leave this building.</p>
          </div>
        </div>
      </section>

      {/* BUILD CTA */}
      <div className="c-build-cta">
        <h2>Decision made, and nobody can build it?</h2>
        <Link to="/contact">That is what our engineering division is for. →</Link>
      </div>

      {/* FINAL CTA */}
      <section className="c-final-cta" id="contact">
        <h2>Need strategic <em>clarity?</em></h2>
        <p><strong>Describe the decision and its context.</strong> You receive an assessment of how we would approach it, the evidence it would take, an indicative scope and timeline, and the team that would be assigned to it. Initial assessments carry no commitment and are treated as confidential.</p>
        <Link to="/contact" className="c-btn-primary">Request an initial assessment →</Link>
      </section>

      {/* CONSULTING FOOTER */}
      <ConsultingFooter />
    </div>
  );
};

export default ConsultingHome;
