module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      gridTemplateColumns: {
        desktop: "300px 1fr",
      },
      gridTemplateRows: {
        desktop: "100vh",
      },
    },
  },
  plugins: [],
};
