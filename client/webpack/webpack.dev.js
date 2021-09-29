const Dotenv = require('dotenv-webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = () => {
  const commonConfig = common()

  const devConfig = {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
      static: {
        directory: 'public',
      },
      compress: true,
      port: process.env.PORT || 3001,
      historyApiFallback: true,
    },
    plugins: [
      new Dotenv({
        path: './.env',
        safe: true,
      }),
    ],
  }

  return merge(commonConfig, devConfig)
}
