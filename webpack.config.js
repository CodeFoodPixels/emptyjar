const path = require("path");

module.exports = {
  entry: {
    main:path.resolve(__dirname, "src", "client", "index.js")
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build")
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: ["@babel/preset-react"] // Transpiles JSX and ES6
            }
          }
        ]
      }
    ]
  }
};
