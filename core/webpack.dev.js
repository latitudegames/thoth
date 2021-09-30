const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = () => {
  const commonConfig = common()

  const devConfig = {
    mode: 'development',
    devtool: 'eval-source-map',
  }

  return merge(commonConfig, devConfig)
}
