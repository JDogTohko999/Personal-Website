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
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
