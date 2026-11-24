import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        atelier: {
          bg: "#FAF2E8",
          bgSecondary: "#F3E2CF",
          card: "#FFFDF9",
          border: "#E5D2BE",
          gold: "#B58A4D",
          goldLight: "#D4AF6E",
          goldDark: "#8F6730",
          burgundy: "#641B24",
          burgundyDark: "#4D1219",
          burgundyLight: "#822633",
          text: "#3C211B",
          textMuted: "#7E6359",
          blush: "#E8C7B6",
          emerald: "#1C5237",
          ruby: "#8F1D2C",
        },
      },
      fontFamily: {
        serif: ["Cinzel", "Playfair Display", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        editorial: ["Cormorant Garamond", "Cinzel", "serif"],
      },
      boxShadow: {
        atelier: "0 4px 20px -2px rgba(60, 33, 27, 0.08)",
        atelierLg: "0 10px 30px -4px rgba(60, 33, 27, 0.12)",
        goldGlow: "0 0 25px rgba(181, 138, 77, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
