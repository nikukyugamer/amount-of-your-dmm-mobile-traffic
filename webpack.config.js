const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: ['./src/entry.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  node: {
    fs: 'empty'
  },
  externals: {
    puppeteer: 'require("puppeteer")'
  },
  plugins: [new Dotenv()]
};
