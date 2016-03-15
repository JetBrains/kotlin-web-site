'use strict';

var path = require('path');
var fs = require('fs');

var Webpack = require('webpack');
var WebpackExtractTextPlugin = require('extract-text-webpack-plugin');
var extend = require('extend');
var autoprefixer = require('autoprefixer');
var config = require('./package.json').config;

var isProduction = process.env.NODE_ENV === 'production';

var webpackConfig = {
  entry: {
    'common': 'entries/common.js',
    'events': 'entries/events/events.js'
  },
  output: {
    path: path.join(__dirname, '_site/_assets'),
    publicPath: '/_assets/',
    filename: '[name].js'
  },
  resolve: {
    modulesDirectories: ['node_modules', './js', './css', './ui']
  },

  debug: isProduction,
  devtool: !isProduction ? 'sourcemap' : false,

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: WebpackExtractTextPlugin.extract([
          'css',
          'postcss'
        ].join('!'))
      },
      {
        test: /\.scss$/,
        loader: WebpackExtractTextPlugin.extract([
          'css',
          'postcss',
          'sass'
        ].join('!'))
      },
      {
        test: /\.nunj$/,
        loader: 'nunjucks-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'advanced-url?limit=10000&name=[path][name].[ext]'
      }
    ]
  },

  postcss: [
    autoprefixer({browsers: ['last 2 versions']})
  ],

  devServer: {
    host: config.devServer.host,
    port: config.devServer.port,
    contentBase: path.resolve(__dirname, '_site')
  },

  plugins: [
    new WebpackExtractTextPlugin('[name].css'),

    new Webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),

    new Webpack.DefinePlugin({
      __DEV__: !isProduction,
      __PROD__: isProduction
    })
  ]
};

module.exports = webpackConfig;


