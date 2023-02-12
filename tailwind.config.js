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
    extend: {},
  },
  plugins: [require("daisyui"), require('tailwind-scrollbar')({ nocompatible: true }),  require('@tailwindcss/aspect-ratio'), require('tw-elements/dist/plugin'), require('flowbite/plugin')],

  daisyui: {
    base:false,
  },
};
