/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Cette ligne est ESSENTIELLE
  theme: {
    extend: {},
  },
  plugins: [],
}