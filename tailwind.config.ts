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
        paper: {
          50: "#faf9f6",
          100: "#f5f4ef",
          200: "#eae8df",
          300: "#d9d6c7",
          800: "#2d2a26",
          900: "#1a1816",
        },
      },
    },
  },
  plugins: [],
};
export default config;
