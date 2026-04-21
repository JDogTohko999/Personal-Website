import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import { ThemeProvider } from './context/ThemeContext.jsx'
import { ParticlesProvider } from './context/ParticlesContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ParticlesProvider>
          <App />
        </ParticlesProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
