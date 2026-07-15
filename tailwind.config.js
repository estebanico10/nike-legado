/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        volt: '#D9FF00',
        black: '#000000',
        white: '#ffffff',
        gray: {
          900: '#111111',
          800: '#222222',
          700: '#333333',
          100: '#f5f5f5',
          50: '#fafafa'
        }
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Impact', 'Oswald', 'sans-serif'],
      },
      screens: {
        'xs': '320px',
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
      maxWidth: {
        'global': '1500px'
      }
    },
  },
  plugins: [],
}
