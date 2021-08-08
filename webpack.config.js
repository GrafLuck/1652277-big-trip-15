"use strict";
const path = require('path')
const outputPath = path.resolve(__dirname, 'public')

module.exports = {
  entry: '@/main.js',
  output: {
    path: outputPath,
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: outputPath,
    watchContentBase: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@view': path.resolve(__dirname, 'src/view'),
      '@mock': path.resolve(__dirname, 'src/mock'),
    },
  },
}
