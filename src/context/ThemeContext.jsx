import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Check localStorage or default to 'default' (which maps to dark mode styles)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'default';
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('portfolio-theme', theme);

    // Apply attribute to document element (html tag)
    // This allows using [data-theme="..."] selectors in CSS
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    themes: [
      { id: 'default', name: 'Default (Dark)', color: '#121212' },
      { id: 'newspaper', name: 'Newspaper', color: '#FFFFFF' },
      { id: 'forest', name: 'Forest', color: '#2D3A3A' },
      { id: 'uva', name: 'UVA', color: '#232D4B' },
    ]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
