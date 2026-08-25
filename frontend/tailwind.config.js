/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#e11d2a',
          dark: '#a10f1a',
          black: '#111318',
        },
      },
    },
  },
  plugins: [],
};
