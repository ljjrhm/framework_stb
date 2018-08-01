const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    index: './src/pages/index/index.tsx'
  },
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }, 'less-loader']
        })
      },
      {
        test: /\.tsx?$/,
        use: ['es3ify-loader','awesome-typescript-loader']
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxSize: 0,
      minChunks: 2,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '_',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: false,
        commons: {
          test: /[\\/]framework|logics|models[\\/]/,
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    },
    runtimeChunk: 'single'
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/pages/index/index.html',
      chunks: ['index','runtime','commons','vendors']
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
}
