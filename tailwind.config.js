/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tell Tailwind to scan all files inside your src directory
  content: ["./src/**/*.{js,jsx,ts,tsx}"], 
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}