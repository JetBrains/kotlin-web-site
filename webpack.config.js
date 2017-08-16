const path = require('path');
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const parseArgs = require('minimist');

const isProduction = process.env.NODE_ENV === 'production';
const env = isProduction ? 'production' : 'development';
const isServer = process.argv.toString().includes('webpack-dev-server');
const CLIArgs = parseArgs(process.argv.slice(2));

const webDemoURL = CLIArgs['webdemo-url'] || 'http://kotlin-web-demo-cloud.passive.aws.intellij.net';
const indexName = CLIArgs['index-name'] || 'dev_KOTLINLANG';

const SCSSExtractor = new ExtractTextPlugin('[name].css');

const webpackConfig = {
  entry: {
    'common': './static/js/page/common.js',
    'index': './static/js/page/index/index.js',
    'events': './static/js/page/events/index.js',
    'videos': './static/js/page/videos.js',
    'grammar': './static/js/page/grammar.js',
    'community': './static/js/page/community/community.js',
    'pdf': './static/js/page/pdf.js',
    'api': './static/js/page/api/api.js',
    'styles': './static/css/styles.scss'
  },

  output: {
    path: path.join(__dirname, '_assets'),
    publicPath: '/_assets/',
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'static/js')
        ]
      },
      {
        test: /\.scss$/,
        loader: SCSSExtractor.extract({
          use: [
            'css-loader',
            {
              loader: 'resolve-url-loader',
              options: {
                keepQuery: true
              }
            },
            'svg-fill-loader/encodeSharp',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.twig$/,
        loader: 'nunjucks-loader'
      },
      {
        test: /\.monk$/,
        loader: 'monkberry-loader'
      },
      {
        test: /\.mustache$/,
        loader: 'mustache-loader'
      },
      {
        test: /\.svg/,
        use: [
          'url-loader',
          'svg-fill-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.(woff|ttf)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      }
    ]
  },

  plugins: [
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'default',
      minChunks: 3
    }),

    new Webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
      Promise: 'imports-loader?this=>global!exports-loader?global.Promise!core-js/es6/promise'
    }),

    new Webpack.DefinePlugin({
      webDemoURL: JSON.stringify(webDemoURL),
      indexName: JSON.stringify(indexName),
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      }
    }),

    SCSSExtractor
  ],

  devServer: {
    port: 9000,
    proxy: {
      '/*': { target: 'http://localhost:5000' }
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


