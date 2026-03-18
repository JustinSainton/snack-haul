/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B4A",
        secondary: "#2DD4A8",
        accent: "#8B5CF6",
        tertiary: "#FBBF24",
        background: "#FFF8F5",
        foreground: "#1F1714",
      },
    },
  },
  plugins: [],
};
