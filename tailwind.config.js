/** @type {import('tailwindcss').Config} */
import { screens } from "tailwindcss/defaultTheme";
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      "title": ["genshin-title", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
      "text": ["genshin-text", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
    },
    screens: {
      "xs": "375px",
      ...screens,
    }
  },
  plugins: [],
}

