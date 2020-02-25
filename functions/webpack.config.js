const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    libraryTarget: 'this',
  },
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.pem$/i,
        use: [
          {
            loader: 'raw-loader',
          },
        ],
      },
      { test: /\.ts?$/, loader: 'ts-loader', exclude: /node_modules/ },
    ],
  },
};
