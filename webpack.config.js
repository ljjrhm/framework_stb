const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    index: './src/pages/index/index.tsx',
    cycle: './src/pages/cycle/cycle.tsx',
    html_test: './src/pages/html_test/html_test.tsx',
    css_test: './src/pages/css_test/css_test.tsx',
    plugin_test: './src/pages/plugin_test/plugin_test.tsx'
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
    }),
    new HtmlWebpackPlugin({
      filename: 'cycle.html',
      template: './src/pages/cycle/cycle.html',
      chunks: ['cycle','runtime','commons','vendors']
    }),
    new HtmlWebpackPlugin({
      filename: 'html_test.html',
      template: './src/pages/html_test/html_test.html',
      chunks: ['html_test','runtime','commons','vendors']
    }),
    new HtmlWebpackPlugin({
      filename: 'css_test.html',
      template: './src/pages/css_test/css_test.html',
      chunks: ['css_test','runtime','commons','vendors']
    }),
    new HtmlWebpackPlugin({
      filename: 'plugin_test.html',
      template: './src/pages/plugin_test/plugin_test.html',
      chunks: ['plugin_test','runtime','commons','vendors']
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
}

// TODO HTML 压缩