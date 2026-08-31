import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConsultingNavbar from '../components/ConsultingNavbar';
import ConsultingTabSwitcher from '../components/ConsultingTabSwitcher';
import ConsultingFooter from '../components/ConsultingFooter';
import { useMode } from '../context/ModeContext';
import './Contact.css';

// Development Version (Original)
const DevelopmentContact = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBudget, setSelectedBudget] = useState('not yet defined');

  const budgetOptions = ['Up to $50k', '$50k–$150K', '$150K–$500K', '$500k +'];

  return (
    <div className="contact-page">
      <Navbar />

      <main className="wrap">

        <section className="hero">
          <h1>Tell us <span className="outline">the problem</span><br />nobody else would take.</h1>
        </section>

        <hr className="divider" />

        <section className="contact-section">
          <div className="contact-copy">
            <p>A description of the problem is enough.<br />
            A specification is not required and at this stage rarely helps.<br />
            Every enquiry is read by a senior engineer, and you will hear back within one business day.</p>

            <span className="avail">Available worldwide &middot; HQ Casablanca, Morocco</span>
          </div>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="field"><input type="text" placeholder="Name" /></div>
            <div className="field"><input type="email" placeholder="Email" /></div>
            <div className="field"><input type="text" placeholder="Organisation" /></div>

            <div className="field-label">Expected budget</div>
            <div className="budget-select mono">{selectedBudget}</div>
            <div className="budget-pills">
              {budgetOptions.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  className={selectedBudget === opt ? 'active' : ''}
                  onClick={() => setSelectedBudget(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="field-label">The problem</div>
            <textarea className="problem" placeholder="Unfinished is fine. Unreasonable is welcome."></textarea>

            <button type="submit" className="send-btn">Send &rarr;</button>
          </form>
        </section>

        <hr className="divider" />

        <Footer />
      </main>
    </div>
  );
};

// Consulting Version (New Design - Standard components)
const ConsultingContact = () => {
  const [selectedBudget, setSelectedBudget] = useState('not yet defined');

  const budgetOptions = ['Up to $50k', '$50k-$150K', '$150K-$500K', '$500k +'];

  const handleBudgetSelect = (budget) => {
    setSelectedBudget(budget);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="consulting-contact-page">

      <ConsultingNavbar />
      <ConsultingTabSwitcher />

      {/* PAGE CONTENT */}
      <div className="cc-page-content">

        <div className="cc-contact-main">

          {/* Hero Title */}
          <h1 className="cc-hero-title">Tell us <span className="cc-outline-text">the decision</span> you cannot afford to get wrong.</h1>

          {/* Form Area */}
          <div className="cc-form-area">

            {/* Left column - Description */}
            <div className="cc-form-left">
              <p className="cc-form-intro">
                Describe the context, the constraints, the timeline, and the body the decision reports to.<br/>
                A senior member of the practice will respond within one business day.<br/>
                Everything you send is treated as <strong>confidential</strong>.
              </p>
              <p className="cc-form-location">Available worldwide · HQ Casablanca, Morocco</p>
            </div>

            {/* Right column - Form Card */}
            <div className="cc-form-card">
              <form onSubmit={handleSubmit}>
                {/* Contact Information */}
                <div className="cc-form-group">
                  <div className="cc-form-section-title">Contact information</div>
                  <input type="text" className="cc-form-input" placeholder="Name"/>
                  <input type="email" className="cc-form-input" placeholder="Email"/>
                </div>

                {/* Institutional Context */}
                <div className="cc-form-group">
                  <div className="cc-form-section-title">Institutional context</div>
                  <input type="text" className="cc-form-input" placeholder="Organisation"/>
                  <input type="text" className="cc-form-input" placeholder="Sector"/>
                </div>

                {/* Expected Budget */}
                <div className="cc-budget-section">
                  <div className="cc-form-section-title-medium">Expected budget</div>
                  <select
                    className="cc-budget-dropdown"
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                  >
                    <option value="not yet defined" disabled>not yet defined</option>
                    {budgetOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="cc-budget-options">
                    {budgetOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        className={`cc-budget-chip ${selectedBudget === opt ? 'cc-selected' : ''}`}
                        onClick={() => handleBudgetSelect(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* The Decision */}
                <div className="cc-decision-section">
                  <div className="cc-form-section-title-medium">The decision</div>
                  <textarea
                    className="cc-form-textarea"
                    placeholder="Include what has already been considered and rejected, if relevant."
                  ></textarea>
                </div>

                {/* Submit */}
                <button type="submit" className="cc-submit-btn">
                  <span>Submit enquiry</span>
                  <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L14 9.5L1 18" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                </button>
              </form>
            </div>

          </div>
        </div>

        <ConsultingFooter />

      </div>
    </div>
  );
};

// Main Contact Component
const Contact = () => {
  const { mode } = useMode();

  // Render different version based on mode
  if (mode === 'consulting') {
    return <ConsultingContact />;
  }
  
  return <DevelopmentContact />;
};

export default Contact;
