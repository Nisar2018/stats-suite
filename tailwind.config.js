/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#001f3f',
          light: '#003366',
          dark: '#001428',
        },
        academic: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        highlight: {
          DEFAULT: '#dbeafe',
          border: '#3b82f6',
        },
      },
      transitionProperty: {
        sidebar: 'width, transform, opacity',
      },
    },
  },
  plugins: [],
};
