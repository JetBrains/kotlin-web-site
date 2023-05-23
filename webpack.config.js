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

  const siteHost = 'localhost:8080';
  const nextJSHost = 'localhost:3000';
  const indexName = params['index-name'] || process.env.INDEX_NAME || 'dev_KOTLINLANG';

  return {
    entry: {
      //shared
      'common': './static/js/page/common.js',
      'index': './static/js/page/index/index.js',
      'videos': './static/js/page/videos.js',
      'grammar': './static/js/page/grammar.js',
      'api': './static/js/page/api/api.js',
      'reference': './static/js/page/reference.js',
      'tutorial': './static/js/page/tutorial.js',
      'dokka-template': './static/js/page/dokka-template/index.js',
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
                importLoaders: 1
              }
            },
            {
              loader: 'resolve-url-loader'
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
          test: /\.svg(?:\?\w+)?$/,
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
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        convertPathData: false,
                      },
                    },
                  },
                  'removeScriptElement'
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

    optimization: {
      runtimeChunk: {
        name: 'shared',
      },
    },

    plugins: [
      new ExtractCssPlugin({
        filename: '[name].css'
      }),

      isProduction && new CssoWebpackPlugin(),

      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
      }),

      new webpack.DefinePlugin({
        indexName: JSON.stringify(indexName),
        'process.env.NODE_ENV': JSON.stringify(env),
        'process.env.ALGOLIA_INDEX_NAME': JSON.stringify(process.env.ALGOLIA_INDEX_NAME)
      })
    ].filter(Boolean),

    devServer: {
      port: 9000,
      hot: true,
      proxy: {
        '/community/**': {
          target: `http://${nextJSHost}`,
          bypass: function (req) {
            req.headers.host = nextJSHost;
          }
        },
        '/_next/**': {
          target: `http://${nextJSHost}`,
          bypass: function (req) {
            req.headers.host = nextJSHost;
          }
        },
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
