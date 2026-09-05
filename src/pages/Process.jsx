import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConsultingFooter from '../components/ConsultingFooter';
import { useMode } from '../context/ModeContext';
import { useReveal } from '../hooks/useScrollFx';

import pushpin from '../assets/figma/pushpin.png';
import puzzle1 from '../assets/figma/puzzle-1.svg';
import puzzle2 from '../assets/figma/puzzle-2.svg';
import puzzle3 from '../assets/figma/puzzle-3.svg';
import puzzle4 from '../assets/figma/puzzle-4.svg';
import evidenceIllus from '../assets/figma/illus-evidence.svg';
import postitsImg from '../assets/figma/postits.png';
import modelImg from '../assets/process-model.png';
import scoreImg from '../assets/process-score.png';
import trackImg from '../assets/process-track.png';

import './Process.css';

/* ================================================================
   PROCESS — mode Development (Figma 22:2893)
   ================================================================ */

const MEASURES = [
  ['Technical precedent:', 'has anything comparable been built, and how did it fail'],
  ['Constraint reality:', 'which limits are physical and which are only assumed'],
  ['Performance envelope:', 'the scale, latency and load the system has to survive'],
  ['Market and operational signals:', 'what the evidence behind similar attempts actually shows'],
];

const STEPS = [
  {
    num: '01',
    title: 'Collect',
    tone: 'dark',
    body: "We gather every relevant technical and market data point before forming a view: prior implementations, published benchmarks, the client's own operational data, and the constraints as stated by the people who set them. Assumptions get flagged as assumptions, not folded silently into the evidence.",
    puzzle: null,
    side: 'left',
  },
  {
    num: '02',
    title: 'Test',
    tone: 'light',
    body: 'Where the existing data does not settle the question, we generate our own. Technical spikes, load tests, small working prototypes built specifically to fail fast if the idea does not hold. A negative result here is cheap. Discovering the same thing after six months of engineering is not.',
    puzzle: puzzle2,
    side: 'right',
  },
  {
    num: '03',
    title: 'Score',
    tone: 'dark',
    body: 'Every finding gets a stated confidence level, tied to what actually supports it. We only call something certain once we have made it certain, not before.',
    puzzle: puzzle3,
    side: 'left',
  },
  {
    num: '04',
    title: 'Decide',
    tone: 'dark',
    body: 'The feasibility report goes to you in writing, with a confidence level attached to each conclusion and a clear recommendation: build, do not build, or test one specific thing further before deciding anything. Some engagements end here, on our advice. That is a legitimate outcome, not a failed one.',
    puzzle: puzzle4,
    side: 'right',
  },
];

const DevelopmentProcess = () => {
  useReveal([]);

  return (
    <div className="pr-root">
      <Navbar />

      <section className="pr-intro">
        {/* Figma pins this puzzle (`sticky top-0`) while the intro scrolls past it */}
        <div className="pr-intro-sticky" aria-hidden="true">
          <img src={puzzle1} alt="" className="pr-intro-puzzle" />
        </div>

        <div className="pr-shell">
          <h1 className="pr-title reveal">
            <span className="u-outline">Before we build</span>, we measure what the odds actually
            are.
          </h1>

          <div className="pr-lede reveal">
            <p>Every engagement starts as an open question, not a specification.</p>
            <p>
              Before we write a line of production code we turn that question into data: benchmarks
              we can run, comparable systems we can inspect, constraints we can test rather than
              assume.
            </p>
            <p>
              We do not have an opinion on whether something is possible until we have gone looking
              for evidence that it is not.
            </p>
            <p>
              What comes back is a stated probability, a confidence level attached to it, and the
              reasoning behind both.
            </p>
            <p className="pr-lede-answer">
              That report exists whether the answer is <b>yes</b> or <b>no</b>.
            </p>
          </div>
        </div>
      </section>

      <hr className="pr-rule" />

      <section className="pr-measure">
        <div className="pr-shell">
          <h2 className="pr-h2 reveal">
            What we measure <span className="u-outline">before we build</span> ?
          </h2>
          <ul className="pr-measure-list reveal">
            {MEASURES.map(([label, detail]) => (
              <li key={label}>
                <span>{label}</span>
                <br />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <hr className="pr-rule" />

      <section className="pr-confidence">
        <div className="pr-shell">
          <h2 className="pr-h2 reveal">Confidence, stated plainly</h2>
          <div className="pr-conf-body reveal">
            <p>Every conclusion in a feasibility report is labelled by what actually supports it.</p>
            <p><b>Proven</b> <span>means we tested it ourselves and it held.</span></p>
            <p><b>Probable</b> <span>means the evidence points one way but has not been run end to end.</span></p>
            <p><b>Unproven</b> <span>means we genuinely do not know yet.</span></p>
            <p>
              We would rather write unproven than dress up a guess as a fact, and clients tell us
              that is the part they end up trusting most.
            </p>
          </div>
        </div>
      </section>

      <hr className="pr-rule" />

      <section className="pr-steps">
        <h2 className="pr-runs reveal">How the process runs</h2>

        {STEPS.map(({ num, title, tone, body, puzzle, side }) => (
          <div className={`pr-step pr-step--${side}`} key={num}>
            {puzzle && <img src={puzzle} alt="" className="pr-puzzle" aria-hidden="true" />}

            <article className={`pr-postit pr-postit--${tone} reveal-scale`}>
              <img src={pushpin} alt="" className="pr-pin" aria-hidden="true" />
              <span className="pr-num">{num}</span>
              <div className="pr-postit-inner">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          </div>
        ))}
      </section>

      <section className="pr-cta">
        <h2 className="reveal">
          <span className="pr-cta-grey">Want the odds</span>{' '}
          <span className="u-outline">before</span>{' '}
          <span className="pr-cta-grey">you commit the budget ?</span>
        </h2>
        <Link to="/contact" className="btn-pill pr-cta-btn reveal">Bring us the hard problem</Link>
      </section>

      <Footer />
    </div>
  );
};

/* ================================================================
   PROCESS — mode Consulting (Figma 22:3368)
   ================================================================ */

const PRINCIPLES = [
  {
    num: '01',
    title: 'Data before opinion',
    body: 'Internal records: financial, operational and transactional data already sitting inside the organisation, checked for quality before it is used for anything. Market and competitive data: pricing, demand signals and comparable organisations, from independent sources rather than assumptions dressed as facts. Primary research: interviews, surveys and field observation where the existing record is silent. Structured expert judgement: where no data exists at all, we say so, and the resulting estimate is treated as an estimate, not a fact.',
  },
  {
    num: '02',
    title: 'Probability, not certainty',
    body: 'We do not hand you a single number and ask you to trust it. Every forecast comes with a range, a stated probability, and the assumptions that would have to hold for the central case to be right. Where an assumption is fragile, the sensitivity analysis says so before the decision is made, not after it has failed.',
  },
  {
    num: '03',
    title: 'Confidence, labelled by source',
    body: 'Every figure in a recommendation is marked by what stands behind it. Verified means the data confirms it directly. Modelled means it follows from a model built on verified inputs. Assumed means no data currently exists, and we say so rather than disguise the gap. A board should be able to tell, line by line, which category each figure belongs to.',
  },
  {
    num: '04',
    title: 'We check our own forecasts',
    body: 'Once a decision is made, we track the outcome against what we predicted. Where we were right, that strengthens the confidence we assign to similar recommendations in future. Where we were wrong, we say so to the client and adjust the model. Few advisory practices publish this kind of accountability internally. We treat it as part of the method, not an afterthought.',
  },
];

const RUN_TABS = [
  {
    key: 'Collect',
    lead: 'We build a complete evidence base before forming a view:',
    body: ' internal records, market data, competitor benchmarks and primary research where the record has gaps. Each source is checked for quality before it goes into the model, not after.',
    image: postitsImg,
  },
  {
    key: 'Model',
    lead: 'Every realistic course of action gets modelled:',
    body: ' expected outcomes, downside exposure, capital and organisational requirements, and the specific conditions under which each alternative would fail.',
    image: modelImg,
  },
  {
    key: 'Score',
    lead: 'Every figure carries a confidence level tied to what stands behind it:',
    body: ' verified, modelled or assumed. A board can tell, line by line, exactly what the recommendation is relying on.',
    image: scoreImg,
  },
  {
    key: 'Track',
    lead: 'Once the decision is made we track the outcome against the forecast:',
    body: ' where we were right the confidence attached to similar recommendations goes up, and where we were wrong we say so and adjust the model.',
    image: trackImg,
  },
];

const TAB_DURATION = 7000;

const ConsultingProcess = () => {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);
  useReveal([active]);

  // Auto-advancing tabs with a filling progress bar (Figma "Frame 150/156").
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / TAB_DURATION);
      setProgress(p);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setActive((v) => (v + 1) % RUN_TABS.length);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  const current = RUN_TABS[active];

  return (
    <div className="pr-c-root">
      <Navbar />

      <main>
        <section className="pr-c-hero">
          <div className="pr-c-hero-copy reveal-left">
            <h1>Every recommendation carries its own evidence file.</h1>
            <p>
              Most advice arrives as an opinion delivered with confidence. Ours arrives with a file
              behind it: the data we collected, the model we built from it, and the probability we
              would put on each alternative before recommending one over another. Where the record
              does not support a conclusion, we say so, and we design the measurement that would. A
              recommendation without a stated confidence level is a preference dressed up as a
              finding. We do not bill for those.
            </p>
          </div>
          <img src={evidenceIllus} alt="" className="pr-c-hero-illus reveal-right" aria-hidden="true" />
        </section>

        <section className="pr-c-principles">
          {PRINCIPLES.map(({ num, title, body }, i) => (
            <article className={`pr-c-principle${i % 2 ? ' is-flipped' : ''} reveal`} key={num}>
              <span className="pr-c-num u-outline-dark" aria-hidden="true">{num}</span>
              <div className="pr-c-principle-copy">
                <h2>{title}</h2>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="pr-c-runs">
          <h2 className="reveal">How the process runs</h2>

          <div className="pr-c-tabs" role="tablist">
            {RUN_TABS.map(({ key }, i) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`pr-c-tab${i === active ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span>{key}</span>
                <span className="pr-c-tab-bar">
                  <span
                    className="pr-c-tab-fill"
                    style={{ transform: `scaleX(${i === active ? progress : i < active ? 1 : 0})` }}
                  />
                </span>
              </button>
            ))}
          </div>

          <div className="pr-c-panel reveal">
            <p>
              <strong>{current.lead}</strong>
              {current.body}
            </p>
            <div className="pr-c-panel-media">
              <img src={current.image} alt={`${current.key} — ADNC method`} key={current.key} />
            </div>
          </div>
        </section>
      </main>

      <ConsultingFooter />
    </div>
  );
};

const Process = () => {
  const { mode } = useMode();
  return mode === 'consulting' ? <ConsultingProcess /> : <DevelopmentProcess />;
};

export default Process;
