/* eslint-disable @typescript-eslint/no-var-requires */

const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const prod = process.env.NODE_ENV === 'production'

const babelOptions = {
  presets: [
    '@babel/env',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        development: process.env.NODE_ENV === 'development',
        importSource: '@welldone-software/why-did-you-render',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
}

module.exports = () => {
  return {
    entry: ['regenerator-runtime/runtime.js', './src/index.js'],
    output: {
      path: path.resolve(__dirname, '../build'),
      filename: '[name].[contenthash].bundle.js',
      clean: true,
    },
    resolve: {
      alias: {
        handlebars: 'handlebars/dist/handlebars.min.js',
        '@': path.resolve(__dirname, 'src'),
        '@thoth': path.resolve(__dirname, 'src/Thoth'),
        '@components': path.resolve(__dirname, 'src/components'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      },
    },
    ignoreWarnings: [/Failed to parse source map/],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-modules-typescript-loader' },
            { loader: 'css-loader' },
          ],
        },
        {
          test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
          type: 'asset/resource',
        },
        {
          test: /\.js(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: babelOptions,
            },
          ],
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: babelOptions,
            },
            {
              loader: 'ts-loader',
              options: {
                compilerOptions: {
                  noEmit: false,
                  outDir: 'build',
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './index.ejs',
        filename: './index.html',
        inject: true,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG),
      }),
      new CopyPlugin({
        patterns: [{ from: 'public', to: '.' }],
      }),
    ],
  }
}
