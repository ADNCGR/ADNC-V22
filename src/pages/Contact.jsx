import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConsultingFooter from '../components/ConsultingFooter';
import { useMode } from '../context/ModeContext';
import { useReveal } from '../hooks/useScrollFx';
import './Contact.css';

const BUDGETS = ['Up to $50k', '$50k-$150K', '$150K-$500K', '$500k +'];

const COPY = {
  development: {
    titleA: 'Tell us ',
    titleOutline: 'the problem',
    titleB: ' nobody else would take.',
    lede: [
      'A description of the problem is enough.',
      'A specification is not required and at this stage rarely helps.',
      'Every enquiry is read by a senior engineer, and you will hear back within one business day.',
    ],
    groups: null,
    lastLabel: 'The problem',
    lastPlaceholder: 'Unfinished is fine. Unreasonable is welcome.',
    submit: 'Send',
    doneTitle: 'Received',
    doneLead: 'This is read by an engineer, not a filter.',
    doneBody:
      'You will hear back within one business day, including if the answer is that we are not the right team for it.',
  },
  consulting: {
    titleA: 'Tell us ',
    titleOutline: 'the decision',
    titleB: ' you cannot afford to get wrong.',
    lede: [
      'Describe the context, the constraints, the timeline, and the body the decision reports to.',
      'A senior member of the practice will respond within one business day.',
      'Everything you send is treated as confidential.',
    ],
    groups: { contact: 'Contact information', context: 'Institutional context' },
    lastLabel: 'The decision',
    lastPlaceholder: 'Include what has already been considered and rejected, if relevant.',
    submit: 'Submit enquiry',
    doneTitle: 'Enquiry received.',
    doneLead: '',
    doneBody:
      'It will be reviewed by a senior member of the practice, and you will have a substantive response within one business day.',
  },
};

const Contact = () => {
  const { mode } = useMode();
  const isConsulting = mode === 'consulting';
  const copy = COPY[isConsulting ? 'consulting' : 'development'];

  const [sent, setSent] = useState(false);
  const [budget, setBudget] = useState('');

  useReveal([mode, sent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rootClass = `ct-root${isConsulting ? ' ct-root--cons' : ''}`;

  if (sent) {
    return (
      <div className={rootClass}>
        <Navbar />
        <section className="ct-done">
          <span className="u-glow ct-done-glow" aria-hidden="true" />
          <h1 className="reveal">{copy.doneTitle}</h1>
          {copy.doneLead && <p className="ct-done-lead reveal">{copy.doneLead}</p>}
          <p className="ct-done-body reveal">{copy.doneBody}</p>
        </section>
        {isConsulting ? <ConsultingFooter /> : <Footer />}
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <Navbar />

      <section className="ct-main">
        <h1 className="ct-title reveal">
          {copy.titleA}
          <span className={isConsulting ? 'u-outline-dark' : 'u-outline'}>{copy.titleOutline}</span>
          {copy.titleB}
        </h1>

        <div className="ct-body">
          <div className="ct-aside reveal-left">
            <div className="ct-lede">
              {copy.lede.map((l) => <p key={l}>{l}</p>)}
            </div>
            <p className="ct-location">Available worldwide · HQ Casablanca, Morocco</p>
          </div>

          <form className="ct-form reveal-right" onSubmit={handleSubmit} noValidate>
            {copy.groups && <p className="ct-group">{copy.groups.contact}</p>}

            <input type="text" name="name" placeholder="Name" required autoComplete="name" />
            <input type="email" name="email" placeholder="Email" required autoComplete="email" />

            {copy.groups && <p className="ct-group">{copy.groups.context}</p>}

            <input type="text" name="organisation" placeholder="Organisation" autoComplete="organization" />
            {copy.groups && <input type="text" name="sector" placeholder="Sector" />}

            <p className="ct-group">Expected budget</p>

            <div className="ct-select">
              <span>{budget || 'not yet defined'}</span>
            </div>

            <div className="ct-chips">
              {BUDGETS.map((b) => (
                <button
                  type="button"
                  key={b}
                  className={`ct-chip${budget === b ? ' is-on' : ''}`}
                  onClick={() => setBudget((v) => (v === b ? '' : b))}
                >
                  {b}
                </button>
              ))}
            </div>

            <p className="ct-group">{copy.lastLabel}</p>
            <textarea name="detail" rows={6} placeholder={copy.lastPlaceholder} />

            <button type="submit" className="ct-submit">
              <span className="ct-submit-arrow" aria-hidden="true">→</span>
              {copy.submit}
              <span className="ct-submit-arrow ct-submit-arrow--r" aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </section>

      {isConsulting ? <ConsultingFooter /> : <Footer />}
    </div>
  );
};

export default Contact;
