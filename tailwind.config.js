/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./script.js"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.bg-custom-image': {
          'background-image': 'url("/images/bg-road.jpg")', // Remplacez avec le chemin de votre image
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}


