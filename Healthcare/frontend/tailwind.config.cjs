

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- THIS MUST BE CORRECT
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}