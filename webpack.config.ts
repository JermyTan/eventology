import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

// works but should be unnecessary
// reference: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/43232
interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  entry: path.join(__dirname, "src", "index.tsx"),
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      path.join(__dirname, "node_modules"),
    ],
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
    }),
  ],
};

export default config;
