/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1B2A',
        slate: '#3B4A5E',
        paper: '#F7F5EF',
        chalk: '#FFFFFF',
        amber: {
          DEFAULT: '#E8A33D',
          dark: '#C7822A',
        },
        moss: '#3F6B4E',
        clay: '#B5533C',
        line: '#E4DFD3',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        chip: '4px',
      },
      boxShadow: {
        card: '0 2px 0 0 #0E1B2A',
      },
    },
  },
  plugins: [],
};
