import React, { createContext, useContext, useState } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  // mode: 'development' | 'consulting'
  const [mode, setMode] = useState('development');

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);
