'use strict';

var path = require('path');
var fs = require('fs');

var Webpack = require('webpack');
var WebpackExtractTextPlugin = require('extract-text-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');
var extend = require('extend');
var autoprefixer = require('autoprefixer');

var isProduction = process.env.NODE_ENV === 'production';

var webpackConfig = {
  entry: {
    'common': 'page/common.js',
    'index': 'page/index.js',
    'events': 'page/events.js',
    'reference': 'page/reference.js',
    'tutorials': 'page/tutorials.js',
    'videos': 'page/videos.js',
    'grammar': 'page/grammar.js',
    'styles': 'styles.scss',
    'pdf': 'page/pdf.js'
  },
  output: {
    path: path.join(__dirname, '_assets'),
    publicPath: '/_assets/',
    filename: '[name].js'
  },
  resolve: {
    modulesDirectories: ['node_modules', './static/js', './static/css']
  },

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
          'resolve-url',
          'sass?sourceMap'
        ].join('!'))
      },
      {
        test: /\.(woff|ttf)$/,
        loader: 'file?name=[path][name].[ext]'
      },
      {
        test: /\.twig$/,
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

  plugins: [
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'default',
      minChunks: 3
    }),

    new Webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),

    new WebpackExtractTextPlugin('[name].css'),

    new LiveReloadPlugin({
      appendScriptTag: false
    })
  ]
};

module.exports = webpackConfig;


