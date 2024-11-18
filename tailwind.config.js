module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "gradient-wave": "gradient-wave 3s ease infinite",
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
      },
    },
  },
  plugins: [],
};
