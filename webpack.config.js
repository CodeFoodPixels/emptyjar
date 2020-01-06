const path = require("path");

const clientPath = path.resolve(__dirname, "client");
const buildPath = path.resolve(__dirname, "build");

module.exports = {
  entry: {
    main: path.resolve(clientPath, "index.js")
  },
  output: {
    filename: "bundle.js",
    path: buildPath
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: ["@babel/preset-react"] // Transpiles JSX and ES6
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
