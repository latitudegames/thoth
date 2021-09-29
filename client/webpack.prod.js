const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = () => {
  const commonConfig = common()

  const prodConfig = {
    mode: 'production',
    plugins: [
      new CompressionPlugin(),
      // {
      //   apply: compiler => {
      //     compiler.hooks.done.tap('DonePlugin', stats => {
      //       console.log('Compile is done !')
      //       setTimeout(() => {
      //         process.exit(0)
      //       })
      //     })
      //   },
      // },
    ],
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  }

  const isAnalyze = typeof process.env.BUNDLE_ANALYZE !== 'undefined'

  if (isAnalyze) {
    prodConfig.plugins.push(new BundleAnalyzerPlugin())
  }

  return merge(commonConfig, prodConfig)
}
