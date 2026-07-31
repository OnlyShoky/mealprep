/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sepia palette matching the original Django project exactly
        sepia: {
          100: '#fffcf6',
          200: '#fff5e4',
          300: '#fff3dd',
          400: '#feeed2',
          500: '#fae5c0',
          600: '#edd3b6',
          700: '#dbc0a1',
          800: '#705C53',
        },
        // Azure palette
        azure: {
          100: '#f8fafc',
          200: '#d9eafd',
        },
      },
      textColor: {
        'normal': '#2f1107',
        'sepia-warn': '#6d2323',
        'sepia-light': '#6d2323',
      },
      fontFamily: {
        'ruslan': ['"Ruslan Display"', 'cursive'],
        'rock-salt': ['"Rock Salt"', 'cursive'],
      },
    },
  },
  plugins: [],
}
