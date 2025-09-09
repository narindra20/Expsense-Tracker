/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // indispensable pour le toggle
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Vite doit scanner tous les fichiers
  theme: {
    extend: {},
  },
  plugins: [],
}
