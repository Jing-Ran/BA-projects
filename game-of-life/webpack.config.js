const path = require('path');
const SRC = path.join(__dirname, 'src/');
const NODE_MODULES = path.join(__dirname, 'node_modules/');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  resolve : {
    modules: [SRC, NODE_MODULES, path.join(SRC, 'scss'), path.join(SRC, 'scripts')],
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: __dirname,
    compress: true,
    hot: true
  },
  optimization: {
    namedModules: true,
  },
  module: {
    rules: [
      {
        // use enforce: 'pre' to check source files
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
          configFile: '.eslintrc'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              hmr: process.env.NODE_ENV === 'development',
              // reloadAll: true
            }
          },
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    new HtmlWebpackPlugin({
      template: `index.html`
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new CleanWebpackPlugin(),
  ],
  //TODO: html linting
};
