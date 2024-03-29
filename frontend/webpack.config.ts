import path from "path";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import Dotenv from "dotenv-webpack";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

// works but should be unnecessary
// reference: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/43232
interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const isDevelopment = process.env.NODE_ENV !== "production";

const plugins = [
  new HtmlWebpackPlugin({
    template: path.join(__dirname, "src", "index.html"),
  }),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].css",
    chunkFilename: "[id].css",
  }),
  new Dotenv(),
];

isDevelopment && plugins.push(new ReactRefreshWebpackPlugin());

const config: Configuration = {
  mode: isDevelopment ? "development" : "production",
  entry: path.join(__dirname, "src", "index.tsx"),
  target: isDevelopment ? "web" : "browserslist",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              // ... other plugins
              isDevelopment && require.resolve("react-refresh/babel"),
            ].filter(Boolean),
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // fallback to style-loader in development
          isDevelopment
            ? "style-loader" // Creates `style` nodes from JS stringss
            : MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [
          // fallback to style-loader in development
          isDevelopment
            ? "style-loader" // Creates `style` nodes from JS stringss
            : MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|woff|woff2|eot|ttf|svg)/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    modules: [
      path.join(__dirname, "src"),
      path.join(__dirname, "node_modules"),
    ],
  },
  output: {
    publicPath: "/",
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js",
    clean: true,
  },
  devServer: {
    contentBase: path.join(__dirname, "build"),
    historyApiFallback: true,
    compress: true,
    port: 3000,
  },
  plugins,
};

export default config;
