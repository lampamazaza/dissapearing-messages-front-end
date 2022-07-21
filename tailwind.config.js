module.exports = {
  content: [
    "./index.html",
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        desktop: "300px 1fr",
        "modile-menu-opened": "1fr 0px",
        "modile-chat-opened": "0px 1fr"
      },
      gridTemplateRows: {
        desktop: "100vh",
        mobile: "100vh 100vh"
      },
      backgroundImage: {
        main: `url("/bg.svg");`
      },
      screens: {
        d: "1200px",
      },
      spacing: {
        2: "2px",
        4: "4px",
        8: "8px",
        10: "10px",
        12: "12px",
        16: "16px",
        20: "20px",
        24: "24px",
        50: "50px",
        100: "100px",
        400: "400px",
      },
      fontSize: {
        20: "20px",
        14: "14px",
        16: "16px",
        10: "10px",
      },
    },
  },
  plugins: [],
};
