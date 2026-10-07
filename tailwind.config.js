/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'portfolio-bg': 'var(--portfolio-bg)',
        'portfolio-text': 'var(--portfolio-text)', 
        'portfolio-gold': 'var(--portfolio-gold)', // Acts as primary accent
        'portfolio-green': 'var(--portfolio-green)', // Acts as secondary accent
        'portfolio-card': 'var(--portfolio-card)',
        'portfolio-card-text': 'var(--portfolio-card-text)', // New variable for card text contrast
        'portfolio-muted': 'var(--portfolio-muted)',
        'portfolio-border': 'var(--portfolio-border)',
        'portfolio-on-gold': 'var(--portfolio-on-gold)',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        // A short clunk when the nudge limit is hit.
        lockshake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-3px)' },
          '45%': { transform: 'translateX(3px)' },
          '70%': { transform: 'translateX(-2px)' },
          '88%': { transform: 'translateX(1px)' },
        },
      },
      animation: {
        lockshake: 'lockshake 420ms ease-in-out',
      },
    },
  },
  plugins: [],
}
