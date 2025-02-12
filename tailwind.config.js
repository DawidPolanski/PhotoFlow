module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        4.5: "1.125rem",
      },
      animation: {
        wave: "wave 6s ease-in-out infinite",
        "light-reflection":
          "light-reflection 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-wave": "gradient-wave 3s ease infinite",
        "wave-text": "wave-text 3s ease-in-out infinite", // New wave effect for text
      },
      backgroundSize: {
        "200%": "200%",
      },
      colors: {
        "bg-dark": "#121212",
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
        wave: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
          "100%": { transform: "translateY(0)" },
        },
        "light-reflection": {
          "0%, 100%": {
            opacity: 0,
            transform: "scale(0.2) rotate(0deg)",
          },
          "50%": {
            opacity: 0.15,
            transform: "scale(0.5) rotate(180deg)",
          },
        },
        "gradient-wave": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "wave-text": {
          "0%, 100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
          "50%": {
            transform: "translateY(-10px)",
            opacity: 0.8,
          },
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
