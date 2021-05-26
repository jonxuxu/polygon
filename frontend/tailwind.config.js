const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundPosition: {
      bottom: "bottom",
      "bottom-8": "center bottom -8rem",
      center: "center",
    },
    extend: {
      colors: {
        teal: colors.teal,
        cyan: colors.cyan,
        primary: colors.pink,
        secondary: colors.rose,
        fuchsia: colors.fuchsia,
      },
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
  variants: {
    extend: {},
  },
};
