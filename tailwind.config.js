/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: "#5A0F1C",
        gold: "#D4AF37",
        cream: "#FAF6F0",
      },
      fontFamily: {
        heading: "var(--font-playfair)",
        body: "var(--font-poppins)",
      },
    },
  },
  plugins: [],
};
