const MODE = "development";
const enabledSourceMap = MODE === "development";

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpack = require('webpack');

module.exports = {
  mode: MODE,
  entry: {
    popup: './src/js/popup.js',
    content: './src/js/content.js',
    background: './src/js/background.js'
  },
  output: {
    path: __dirname + '/plugin',
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: enabledSourceMap,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: enabledSourceMap,
              plugins: () => [require('autoprefixer')]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: enabledSourceMap
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new webpack.ProvidePlugin({$: 'jquery'})
  ],
  devtool: 'source-map'
};
