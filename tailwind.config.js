/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        'text': '#020d06',
        'background': '#ffffff',
        'primary': '#42614c',
        'secondary': '#8fd2ef',
        'accent': '#638de9',
       },
      // Add custom gradient variables
      gradientColorStops: {
        'linearPrimarySecondary': 'linear-gradient(#7cda9d, #413e3e)',
        'linearPrimaryAccent': 'linear-gradient(#7cda9d, #7bb5b7)',
        'linearSecondaryAccent': 'linear-gradient(#413e3e, #7bb5b7)',
        'radialPrimarySecondary': 'radial-gradient(#7cda9d, #413e3e)',
        'radialPrimaryAccent': 'radial-gradient(#7cda9d, #7bb5b7)',
        'radialSecondaryAccent': 'radial-gradient(#413e3e, #7bb5b7)',
      },
      fontSize: {
        sm: '0.750rem',
        base: '1rem',
        xl: '1.333rem',
        '2xl': '1.777rem',
        '3xl': '2.369rem',
        '4xl': '3.158rem',
        '5xl': '4.210rem',
      },

    },
  },
  plugins: [
    require('daisyui'),
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
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#42614c",
          "secondary": "#8fd2ef",
          "accent": "#638de9",
          "neutral": "#0a4219",
          "base-100": "#f2fdf5",
        },
        dark: {
          "primary": "#9ebda8",
          "secondary": "#105370",
          "accent": "#16419c",
          "neutral": "#0a4219",
          "base-100": "#020d05",
        },
      },
    ], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    //darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};

