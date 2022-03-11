const Dotenv = require('dotenv-flow-webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = () => {
  const commonConfig = common()

  const prodConfig = {
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
  }

  const isAnalyze = typeof process.env.BUNDLE_ANALYZE !== 'undefined'

  if (isAnalyze) {
    prodConfig.plugins.push(new BundleAnalyzerPlugin())
  }

  return merge(commonConfig, prodConfig)
}
