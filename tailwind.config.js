/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './node_modules/tw-elements/dist/js/**/*.js',
    './src/**/*.{html,js}',
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%': {
            transform: 'translate(0, 0)',
            opacity: 1,
          },
          '100%': {
            transform: 'translate(0, -50px)',
            opacity: 0,
          },
        },
      },
      animation: {
        'heart-float': 'float 0.8s forwards',
      },
      fontFamily: {
        'retropix': ['retropix', 'mono']
      },
    },
  },
  plugins: [require("daisyui"), require('tailwind-scrollbar')({ nocompatible: true }),  require('@tailwindcss/aspect-ratio'), require('tw-elements/dist/plugin'), require('flowbite/plugin')],

  daisyui: {
    base:false,
  },
};
