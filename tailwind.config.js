/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    './components/**/*.{vue,js,ts,scss}',
    './layouts/**/*.{vue,js,ts,scss}',
    './pages/**/*.{vue,js,ts,scss}',
    './app.{js,ts,scss}',
    './plugins/**/*.{js,ts,scss}',
    './nuxt.config.{js,ts,scss}',
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1700px',
      },
    }
  },
  plugins: []
};
