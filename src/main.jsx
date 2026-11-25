import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { initLook } from './lib/look.js';

initLook(); // review variations: ?look=haze (default)|card|scree|dusk, ?zoom=100|110

// sky has one palette, written for the photo (see the tokens at the top of index.css), so the
// base's ThemeProvider and palette switcher are not mounted.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
