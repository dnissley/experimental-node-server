const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname, 'frontend'),
  entry: './index.jsx',
  output: {
    path: path.resolve(__dirname, 'static')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './index.html'
      /* filename: '../static/index.html' */
    })
  ]
}
