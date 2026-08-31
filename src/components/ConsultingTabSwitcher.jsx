import React from 'react';
import { useMode } from '../context/ModeContext';
import './consulting-standard.css';

const ConsultingTabSwitcher = () => {
  const { mode, setMode } = useMode();

  return (
    <div className="cs-tab-wrapper">
      <div className="cs-tab-switcher">
        <button
          type="button"
          className={`cs-tab cs-tab-dev ${mode === 'development' ? 'cs-tab-active' : ''}`}
          onClick={() => setMode('development')}
          aria-pressed={mode === 'development'}
        >
          Development
        </button>
        <button
          type="button"
          className={`cs-tab cs-tab-cons ${mode === 'consulting' ? 'cs-tab-active' : ''}`}
          onClick={() => setMode('consulting')}
          aria-pressed={mode === 'consulting'}
        >
          Consulting
        </button>
      </div>
    </div>
  );
};

export default ConsultingTabSwitcher;
