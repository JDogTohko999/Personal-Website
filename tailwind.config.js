/** @type {import('tailwindcss').Config} */
// Tailwind stays because the content modules (blog posts, now entry, profile, vaisi) use its
// classes. The portfolio-* colours are legacy names mapped to the theme in src/theme/themes.css.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'portfolio-bg': 'var(--portfolio-bg)',
        'portfolio-text': 'var(--portfolio-text)',
        'portfolio-gold': 'var(--portfolio-gold)',
        'portfolio-green': 'var(--portfolio-green)',
        'portfolio-card': 'var(--portfolio-card)',
        'portfolio-card-text': 'var(--portfolio-card-text)',
        'portfolio-muted': 'var(--portfolio-muted)',
        'portfolio-border': 'var(--portfolio-border)',
        'portfolio-on-gold': 'var(--portfolio-on-gold)',
      },
    },
  },
  plugins: [],
};
