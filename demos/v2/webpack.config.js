var path = require('path');
module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
  entry: [
    './main.js'
  ],
  output: {
    filename: 'bundle.js'
  },
};
