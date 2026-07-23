/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        charcoal: "#111827",
        "azure-blue": "#2272F9",
        "impact-red": "#F44051",
        "surface-gray": "#F8FAFC",
        "slate-gray": "#64748B",
        "surface-variant": "#e0e3e5",
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
