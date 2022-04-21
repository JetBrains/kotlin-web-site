const packageJSON = require('./package.json');

const withPlugins = require('next-compose-plugins');
const { patchWebpackConfig } = require('next-global-css');
const optimizedImages = require('next-optimized-images');
const nextTranspileModules = require('next-transpile-modules');

let transpiledPackages = [
  '@jetbrains/kotlin-web-site-ui',
  ...(Object.keys(packageJSON.dependencies).filter(it => it.includes('@rescui/')))
];

const withTranspile = nextTranspileModules(transpiledPackages);

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  fileExtensions: ["jpg", "jpeg", "png", "gif", "svg"],
  inlineImageLimit: 0,
  images: {
    disableStaticImages: true,
  },
  webpack: (config, options) => {
    patchWebpackConfig(config, options);

    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'yaml-loader'
    });

    return config
  },
};

module.exports = withPlugins([
  [withTranspile],
  [optimizedImages, {
    handleImages: ['jpeg', 'png', 'svg'],
    imagesFolder: 'images',
    optimizeImagesInDev: true
  }]
], nextConfig);
