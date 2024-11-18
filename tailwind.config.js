module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        4.5: "1.125rem",
      },
      animation: {
        "gradient-wave": "gradient-wave 3s ease infinite",
        "gradient-border": "gradient-border 3s ease infinite",
      },
      backgroundSize: {
        "200%": "200%",
      },
      colors: {
        "bg-dark": "#242424",
        "text-light": "#fff",
        primary: "#646cff",
        secondary: "#535bf2",
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"],
        dancing: ["Dancing Script", "cursive"],
        caveat: ["Caveat", "cursive"],
      },
      spacing: {
        64: "16rem",
      },
      keyframes: {
        "gradient-wave": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },

        "gradient-border": {
          "0%": {
            borderImage:
              "linear-gradient(90deg, rgba(0, 150, 255, 1) 0%, rgba(255, 0, 255, 1) 100%)",
            borderImageSlice: 1,
          },
          "50%": {
            borderImage:
              "linear-gradient(90deg, rgba(255, 0, 255, 1) 0%, rgba(0, 150, 255, 1) 100%)",
            borderImageSlice: 1,
          },
          "100%": {
            borderImage:
              "linear-gradient(90deg, rgba(0, 150, 255, 1) 0%, rgba(255, 0, 255, 1) 100%)",
            borderImageSlice: 1,
          },
        },
      },
    },
  },
  plugins: [],
};
