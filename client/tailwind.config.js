/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102033",
        line: "#d8e1ec",
        panel: "#f7f9fc",
        brand: "#0f5bd8",
      },
      boxShadow: {
        soft: "0 12px 40px rgba(16, 32, 51, 0.08)",
      },
    },
  },
  plugins: [],
};

