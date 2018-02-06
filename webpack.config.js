const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

module.exports = (params = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = !isProduction;
  const env = isProduction ? 'production' : 'development';
  const isServer = process.argv.toString().includes('webpack-dev-server');
  const sourcemaps = params.sourcemaps || isDevelopment;

  const siteHost = 'localhost:5000';
  const webDemoURL = params['webdemo-url'] || 'http://kotlin-web-demo-cloud.passive.aws.intellij.net';
  const indexName = params['index-name'] || 'dev_KOTLINLANG';

  const config = {
    entry: {
      'common': './static/js/page/common.js',
      'index': './static/js/page/index/index.js',
      'events': './static/js/page/events/index.js',
      'videos': './static/js/page/videos.js',
      'grammar': './static/js/page/grammar.js',
      'community': './static/js/page/community/community.js',
      'pdf': './static/js/page/pdf.js',
      'api': './static/js/page/api/api.js',
      'reference': './static/js/page/reference.js',
      'tutorial': './static/js/page/tutorial.js',
      'styles': './static/css/styles.scss'
    },

    output: {
      path: path.join(__dirname, '_assets'),
      publicPath: '/_assets/',
      filename: '[name].js'
    },

    devtool: sourcemaps ? 'source-map' : false,

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
          loader: ExtractTextPlugin.extract({
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
      new ExtractTextPlugin('[name].css'),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'default',
        minChunks: 3
      }),

      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
        Promise: 'imports-loader?this=>global!exports-loader?global.Promise!core-js/es6/promise'
      }),

      new webpack.DefinePlugin({
        webDemoURL: JSON.stringify(webDemoURL),
        indexName: JSON.stringify(indexName),
        'process.env.NODE_ENV': JSON.stringify(env)
      })
    ],

    stats: 'errors-only',

    devServer: {
      port: 9000,
      stats: 'errors-only',
      proxy: {
        '/**': {
          target: `http://${siteHost}`,
          bypass: function (req) {
            req.headers.host = siteHost;
          }
        }
      }
    }
  };

  const plugins = config.plugins;

  if (!isServer) {
    plugins.push(new CleanPlugin(['_assets']))
  }

  if (isProduction) {
    const minimizePlugin = new UglifyJsPlugin({ sourceMap: sourcemaps });
    const minimizeLoaderOptionPlugin = new LoaderOptionsPlugin({ minimize: true });
    plugins.push(minimizePlugin);
    plugins.push(minimizeLoaderOptionPlugin);
  }

  return config;
};
