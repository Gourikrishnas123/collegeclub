export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': 'radial-gradient(circle at top left, rgba(96, 165, 250, 0.18), transparent 24%), radial-gradient(circle at top right, rgba(168, 85, 247, 0.14), transparent 20%)',
      },
      boxShadow: {
        glass: '0 24px 80px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
};
