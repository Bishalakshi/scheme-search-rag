/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0D1117",
        surface: "#161B22",
        border: "#30363D",
        saffron: "#FF9933",
        saffronlight: "#FFB347",
        green: "#3FB950",
        text: "#E6EDF3",
        muted: "#8B949E",
        card: "#1C2128",
        badge: "#21262D",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}