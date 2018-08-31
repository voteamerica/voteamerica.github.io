module.exports = {
  watchOptions: {
    poll: 10000
  },
  entry: { app: './webpack/entry.js' },
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
