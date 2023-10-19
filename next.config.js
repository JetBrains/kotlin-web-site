const packageJSON = require('./package.json');

const withPlugins = require('next-compose-plugins');
const { patchWebpackConfig } = require('next-global-css');
const nextTranspileModules = require('next-transpile-modules');
const optimizedImages = require('next-optimized-images');

let transpiledPackages = [
  '@jetbrains/kotlin-web-site-ui',
  ...(Object.keys(packageJSON.dependencies).filter(it => it.includes('@rescui/'))),
  // transitive deps needed too:
    '@rescui/dropdown',
    '@rescui/menu'
];

const withTranspile = nextTranspileModules(transpiledPackages);

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

  images: {
    disableStaticImages: true
  },

  trailingSlash: true,

  eslint: {
    dirs: ['blocks', 'components', 'pages'],
  },

  webpack: (config, options) => {
    patchWebpackConfig(config, options);

    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'yaml-loader'
    });

    config.module.rules.push({
        test: /\.md$/,
        type: 'asset/source'
    });

    return config
  },
};

module.exports = withPlugins([
  [withTranspile],
  [optimizedImages]
], nextConfig);
