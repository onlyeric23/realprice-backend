const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  return {
    optimization: {
      minimize: false // Minimization kill Sequelize-typescript Model's declaration for unknown reason.
    },
    entry: './src/index.ts',
    devtool: argv.mode === 'production' ? false : 'cheap-source-map',
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
      rules: [{ test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }],
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['!*.pem'],
      }),
    ],
  };
};
