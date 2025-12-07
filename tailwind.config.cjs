/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B0000",
        gold: "#D4AF37",
        charcoal: "#111111",
        offwhite: "#f9f5ef"
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 40px rgba(0,0,0,0.18)"
      }
    }
  },
  plugins: []
};




