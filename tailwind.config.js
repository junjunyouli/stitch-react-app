/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mystic: {
          light: '#f3e8ff',
          DEFAULT: '#a855f7',
          dark: '#6b21a8',
        },
        gold: '#D4AF37'
      },
      animation: {
        sparkle: 'sparkle 2s infinite ease-in-out',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        }
      }
    },
  },
  plugins: [],
}