/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d0d0d',
        panel: '#161616',
        primary: '#c9791a',
        border: '#333333',
        text: '#e5e5e5',
      }
    },
  },
  plugins: [],
}
