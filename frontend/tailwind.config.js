const { hairlineWidth, platformSelect } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.tsx","./components/**/*.tsx","./demo/**/*.tsx"],
  presets: [require('nativewind/preset')],

  plugins: [],
};

