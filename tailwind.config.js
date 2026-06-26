/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6200EE",
        background: "#F9FAFB",
        foreground: "#000000",
        error: "#B00020",
        border: "#E0E0E0",
      },
    },
  },
  plugins: [],
};