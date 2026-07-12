/** @type {import('tailwindcss').Config} */
// NOTE: In Tailwind v4, design tokens are defined in src/index.css via @theme {}.
// This file is kept for content path scanning only.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
