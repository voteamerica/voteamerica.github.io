const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const outputPath = path.resolve(__dirname, 'scripts');

console.log('outputPath', outputPath);

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: outputPath
  },
  devServer: {
    contentBase: './scripts'
  }
});
