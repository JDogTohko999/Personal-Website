import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import { ThemeProvider } from './context/ThemeContext.jsx'
import { ParticlesProvider } from './context/ParticlesContext.jsx'
import { FunModeProvider } from './context/FunModeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <FunModeProvider>
          <ParticlesProvider>
            <App />
          </ParticlesProvider>
        </FunModeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
