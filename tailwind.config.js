/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pnp: {
          dark: '#0d3b2e',
          medium: '#1a4d3e',
          light: '#255949',
          border: '#2d6654',
        },
        person: {
          lozano: '#60a5fa',
          lopez: '#34d399',
          solsol: '#fbbf24',
          olivares: '#c084fc',
          cieza: '#f87171',
        },
      },
    },
  },
  plugins: [],
}
