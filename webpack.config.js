const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const clientPath = path.resolve(__dirname, "src", "client");
const buildPath = path.resolve(__dirname, "build");

module.exports = {
  entry: {
    main: path.resolve(clientPath, "index.js")
  },
  output: {
    filename: "bundle.js",
    path: buildPath
  },
  plugins: [
    new CopyPlugin([
      { from: path.resolve(clientPath, "public"), to: buildPath }
    ])
  ],
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
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
