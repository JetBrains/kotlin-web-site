'use strict';

const path = require('path');
const fs = require('fs');

const Webpack = require('webpack');
const WebpackExtractTextPlugin = require('extract-text-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const extend = require('extend');
const autoprefixer = require('autoprefixer');
const parseArgs = require('minimist');

const isProduction = process.env.NODE_ENV === 'production';
const isServer = process.argv.toString().includes('webpack-dev-server');
const CLIArgs = parseArgs(process.argv.slice(2));
const webDemoURL = CLIArgs['webdemo-url'] || 'http://kotlin-web-demo-cloud.passive.aws.intellij.net';
const indexName = CLIArgs['index-name'] || 'dev_KOTLINLANG';

const webpackConfig = {
  entry: {
    'common': 'page/common.js',
    'index': 'page/index/index.js',
    'events': 'page/events/index.js',
    'videos': 'page/videos.js',
    'grammar': 'page/grammar.js',
    'community': 'page/community/community.js',
    'styles': 'styles.scss',
    'pdf': 'page/pdf.js',
    'api': 'page/api/api.js'
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
        test: /\.monk$/,
        loader: 'monkberry-loader'
      },
      {
        test: /\.mustache$/,
        loader: 'mustache-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'static/js')
        ]
      },
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
          'resolve-url?keepQuery',
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
        test: /\.svg/,
        loaders: [
          'url',
          'svg-fill'
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
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
      'window.jQuery': 'jquery',
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
      Promise: 'imports?this=>global!exports?global.Promise!core-js/es6/promise'
    }),

    new Webpack.DefinePlugin({
      webDemoURL: JSON.stringify(webDemoURL),
      indexName: JSON.stringify(indexName)
    }),

    new WebpackExtractTextPlugin('[name].css')
  ],

  devServer: {
    proxy: {
      '/**': {
        target: 'http://localhost:5000'
      }
    }
  }
};

if (!isServer) {
  webpackConfig.plugins.push(
    new LiveReloadPlugin({
      appendScriptTag: false
    })
  );
}

module.exports = webpackConfig;


