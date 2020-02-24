const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: path.resolve(__dirname, './src/entry.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  node: {
    fs: 'empty',
    __dirname: false
  },
  externals: {
    puppeteer: 'require("puppeteer")'
  },
  plugins: [new Dotenv()]
};
