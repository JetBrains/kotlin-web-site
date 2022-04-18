const packageJSON = require('./package.json');

const withPlugins = require('next-compose-plugins');
const { withGlobalCss } = require('next-global-css');
const optimizedImages = require('next-optimized-images');
const nextTranspileModules = require('next-transpile-modules');
const withConfigCss = withGlobalCss();

let transpiledPackages = [
  '@jetbrains/kotlin-web-site-ui',
  ...(Object.keys(packageJSON.dependencies).filter(it => it.includes('@rescui/')))
];

const withTranspile = nextTranspileModules(transpiledPackages);

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  fileExtensions: ["jpg", "jpeg", "png", "gif"],
  inlineImageLimit: 0,
  images: {
    disableStaticImages: true,
  }
};

module.exports = withPlugins([
  [withConfigCss],
  [withTranspile],
  [optimizedImages, {
    handleImages: ['jpeg', 'png'],
    imagesFolder: 'images',
    optimizeImagesInDev: true
  }]
], nextConfig);
