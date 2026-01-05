/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'portfolio-bg': '#121212',
        'portfolio-text': '#E0E0E0', 
        'portfolio-gold': '#D4AF37',
        'portfolio-green': '#1A3C34',
        'portfolio-card': '#1E1E1E'
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
