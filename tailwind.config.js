/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // slate-900
        primary: '#34d399', // emerald-400
        secondary: '#0ea5e9', // sky-500 (ocean blue)
        accent: '#38bdf8', // light blue
      },
    },
  },
  plugins: [],
}
