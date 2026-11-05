/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        champagne: {
          50: '#FBF8F2',
          100: '#F5EFE3',
          200: '#EBDDC6',
          300: '#DEC5A2',
          400: '#D4B685',
          500: '#C9A46A', // Primary Champagne Gold
          600: '#B88E52',
          700: '#99733F',
          800: '#7C5D36',
          900: '#644C2E',
        },
        ivory: {
          DEFAULT: '#FAF7F2',
          light: '#FDFBF7',
          dark: '#F0EBE1',
        },
        pageBg: '#F8F6F2',
        cardBg: '#FFFFFF',
        textDark: '#292524',
        textMuted: '#78716C',
        dustyRose: {
          50: '#FAF5F4',
          100: '#F4ECE9',
          200: '#E8D5D0', // Accent
          300: '#D9BCB4',
          400: '#C79D93',
          500: '#B07D72',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(41, 37, 36, 0.05)',
        'premium': '0 10px 30px -4px rgba(201, 164, 106, 0.12)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};

