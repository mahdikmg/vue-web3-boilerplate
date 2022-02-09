const path = require("path");

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  configureWebpack: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "src/"),
      },
    },
    // mode: 'production'
  },

  // outputDir: 'dist/dashboard'
};
