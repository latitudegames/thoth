const Dotenv = require('dotenv-flow-webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const fs = require('fs')

module.exports = () => {
  const commonConfig = common()

  const devConfig = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
      https: {
        key: fs.readFileSync('certs/key.pem'),
        cert: fs.readFileSync('certs/cert.pem'),
      },
      static: {
        directory: 'public',
      },
      compress: true,
      port: process.env.PORT || 3001,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          // include: [path.resolve(__dirname, 'node_modules/@latitudegames')],
          use: ['source-map-loader'],
        },
      ],
    },
    plugins: [
      new Dotenv(),
    ],
  }

  return merge(commonConfig, devConfig)
}