const path = require('path');

const webpack = require('webpack');
const ExtractCssPlugin = require('mini-css-extract-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;

module.exports = (params = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = !isProduction;
  const env = isProduction ? 'production' : 'development';
  const isDevServer = process.env.WEBPACK_SERVE === 'true';
  const sourcemaps = params.sourcemaps || isDevelopment;

  const siteHost = 'localhost:5000';
  const webDemoURL = params['webdemo-url'] || 'http://kotlin-web-demo-cloud.passive.aws.intellij.net';
  const indexName = params['index-name'] || 'dev_KOTLINLANG';

  return {
    entry: {
      'common': './static/js/page/common.js',
      'index': './static/js/page/index/index.js',
      'events': './static/js/page/events/index.js',
      'videos': './static/js/page/videos.js',
      'grammar': './static/js/page/grammar.js',
      'community': './static/js/page/community/community.js',
      'education': './static/js/page/education/education.js',
      'api': './static/js/page/api/api.js',
      'reference': './static/js/page/reference.js',
      'tutorial': './static/js/page/tutorial.js',
      'styles': './static/css/styles.scss',
      'styles-v2': './static/css/styles-v2.scss'
    },

    output: {
      path: path.join(__dirname, '_assets'),
      publicPath: '/_assets/',
      filename: '[name].js',
      clean: !isDevServer,
    },

    devtool: sourcemaps ? 'source-map' : false,

    mode: env,
    bail: !isDevServer,

    resolve: {
      alias: {
        'react': 'react',
        'react-dom': 'react-dom',
      },
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          include: [
            path.resolve(__dirname, 'static/js')
          ]
        },
        {
          test: /\.s?css$/,
          use: [
            ExtractCssPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2
              }
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'svg-transform-loader/encode-query'
            },
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
        },
        {
          test: /\.twig$/,
          loader: 'nunjucks-loader'
        },
        {
          test: /\.mustache$/,
          loader: 'mustache-loader'
        },
        {
          test: /\.svg/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                encoding: 'utf8',
                esModule: false,
                generator: (content, mimetype, encoding) => svgToMiniDataURI(content.toString(encoding)),
              },
            },
            {
              loader: 'svgo-loader',
              options: {
                plugins: [
                  {removeTitle: true},
                  {convertPathData: false},
                  {removeScriptElement:true}
                ]
              }
            }
          ],
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 10000,
            name: '[path][name].[ext]'
          }
        },
        {
          test: /\.(woff2?|ttf)$/,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      ]
    },

    plugins: [
      new ExtractCssPlugin({
        filename: '[name].css'
      }),

      isProduction &&  new CssoWebpackPlugin(),

      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      }),

      new webpack.DefinePlugin({
        webDemoURL: JSON.stringify(webDemoURL),
        indexName: JSON.stringify(indexName),
        'process.env.NODE_ENV': JSON.stringify(env)
      })
    ].filter(Boolean),

    stats: 'minimal',

    devServer: {
      port: 9000,
      hot: true,
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
};
