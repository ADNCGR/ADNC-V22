import React, { createContext, useContext, useEffect, useState } from 'react';

const ModeContext = createContext();
const STORAGE_KEY = 'adnc-mode';

const readInitialMode = () => {
  if (typeof window === 'undefined') return 'development';
  const fromQuery = new URLSearchParams(window.location.search).get('mode');
  if (fromQuery === 'consulting' || fromQuery === 'development') return fromQuery;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'consulting' || stored === 'development') return stored;
  } catch {
    /* private mode / storage disabled — fall through to the default */
  }
  return 'development';
};

export const ModeProvider = ({ children }) => {
  // mode: 'development' | 'consulting'
  const [mode, setMode] = useState(readInitialMode);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);
