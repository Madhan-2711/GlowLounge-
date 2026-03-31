export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonRed: '#ff003c',
        darkSurface: '#121212',
        darkBg: '#090909'
      },
      boxShadow: {
        'neon-red': '0 0 15px rgba(255, 0, 60, 0.5)',
        'neon-green': '0 0 15px rgba(0, 255, 100, 0.5)',
      }
    },
  },
  plugins: [],
}
