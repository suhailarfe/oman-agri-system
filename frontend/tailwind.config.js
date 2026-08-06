/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14213D', inkLight: '#2C4A73',
        paper: '#F4F5F1', border: '#E2E4DD',
        teal: { DEFAULT: '#16707A', light: '#E1EFF0' },
        green: { DEFAULT: '#33633B', light: '#E7F0E4' },
        sand: { DEFAULT: '#B99A5B', light: '#F3ECDC' },
        rust: { DEFAULT: '#B5470E', light: '#FBEAE2' },
        textSecondary: '#5C6370',
      },
      fontFamily: {
        kufi: ['"Noto Kufi Arabic"', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
