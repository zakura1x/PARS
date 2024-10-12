/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({addUtilities}){
      const newUtilities = {".no-scrollbar::-webkit-scrollbar":{
        display: "none",
      },
      ".no-scrollbar":{
        "-ms-overflow-style": "none",
        "scrollbar-width" : "none",
      },
    };
    addUtilities(newUtilities);
  },
  ],
};

