/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./error.vue",
  ],
  daisyui: {
    themes: ["light"],
  },
  theme: {
    extend: {
      colors: {
        xlinks: {
          50: "#f5f8fa",
          100: "#e9eff5",
          200: "#cfdee8",
          300: "#a4c1d5",
          400: "#73a0bd",
          500: "#5184a6",
          600: "#3e6989",
          700: "#345670",
          800: "#2e495e",
          900: "#2a3f50",
          950: "#1c2935",
        },
        "xlinks-secondary": {
          50: "#f0f8ff",
          100: "#dfefff",
          200: "#cae8ff",
          300: "#79c8ff",
          400: "#32adfe",
          500: "#0792f0",
          600: "#0073cd",
          700: "#005ba6",
          800: "#034e89",
          900: "#094271",
          950: "#06294b",
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
