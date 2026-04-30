/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './public/**/*.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff4eb',
          100: '#ffe7d1',
          200: '#ffd0a3',
          300: '#ffb067',
          400: '#ff8a33',
          500: '#ff6a00',
          600: '#e85f00',
          700: '#c44f00',
          800: '#9d4104',
          900: '#7f360a',
        },
        brand: {
          50: '#fff4eb',
          100: '#ffe7d1',
          200: '#ffd0a3',
          300: '#ffb067',
          400: '#ff8a33',
          500: '#ff6a00',
          600: '#e85f00',
          700: '#c44f00',
          800: '#9d4104',
          900: '#7f360a',
        },
        surface: {
          DEFAULT: 'rgb(var(--bg-card) / <alpha-value>)',
          muted: 'rgb(var(--bg-secondary) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #ff6a00 0%, #ff8a33 100%)',
      },
      boxShadow: {
        ui: '0 1px 2px 0 rgb(0 0 0 / 0.35), 0 1px 3px 0 rgb(0 0 0 / 0.25)',
        'ui-md': '0 10px 20px -8px rgb(0 0 0 / 0.45), 0 4px 8px -4px rgb(0 0 0 / 0.25)',
        'ui-lg': '0 24px 48px -16px rgb(0 0 0 / 0.6), 0 8px 16px -8px rgb(0 0 0 / 0.3)',
      },
    },
  },
  plugins: [],
};
