const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputPath = path.resolve(__dirname, 'scripts');

console.log('outputPath', outputPath);

module.exports = {
  watchOptions: {
    poll: 10000
  },
  entry: { app: './webpack/entry.js' },
  output: {
    filename: '[name].bundle.js',
    path: outputPath
  },
  plugins: [
    new CleanWebpackPlugin(['scripts']),
    new HtmlWebpackPlugin({ title: 'Production' })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/(node_modules)/],
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['react'],
              plugins: ['transform-object-rest-spread']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
