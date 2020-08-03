
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpack = require('webpack');

module.exports = (env, options) => {
  const enabledSourceMap = options.mode === 'development';
  return {
    mode: options.mode,
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
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env'
                ]
              }
            }
          ]
        },
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
                // sourceMap: enabledSourceMap,
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                // sourceMap: enabledSourceMap,
                plugins: () => [require('autoprefixer')]
              }
            },
            {
              loader: 'sass-loader',
              // options: {
              //   sourceMap: enabledSourceMap
              // }
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
    devtool: enabledSourceMap === true ? 'source-map' : false
  }
};
