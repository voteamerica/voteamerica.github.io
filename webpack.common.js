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
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [
                [
                  '@babel/plugin-transform-runtime',
                  {
                    corejs: false,
                    helpers: true,
                    regenerator: true,
                    useESModules: false
                  }
                ],
                '@babel/plugin-transform-regenerator',
                '@babel/plugin-proposal-object-rest-spread',
                'babel-plugin-styled-components'
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  performance: {
    maxEntrypointSize: 350000,
    maxAssetSize: 350000
  }
};
