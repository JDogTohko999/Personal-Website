import React, { createContext, useContext, useState } from 'react';

// Fun mode turns on the particles and the Jason-ing wheel. Every visit starts
// in the normal (boring) outlook; visitors opt in from under the headshot. The
// choice lives only in memory, so it carries across pages within a visit but
// a reload or new visit starts boring again.

const FunModeContext = createContext();

export const useFunMode = () => {
  const context = useContext(FunModeContext);
  if (!context) {
    throw new Error('useFunMode must be used within a FunModeProvider');
  }
  return context;
};

export const FunModeProvider = ({ children }) => {
  const [funMode, setFunMode] = useState(false);

  return (
    <FunModeContext.Provider value={{ funMode, setFunMode }}>
      {children}
    </FunModeContext.Provider>
  );
};
