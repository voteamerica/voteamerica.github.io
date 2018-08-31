const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const outputPath = path.resolve(__dirname, 'scripts');

console.log('outputPath', outputPath);

module.exports = merge(common, {
  mode: 'production',
  devtool: 'cheap-source-map',
  output: {
    filename: 'bundle-production.js',
    path: outputPath
  }
});
