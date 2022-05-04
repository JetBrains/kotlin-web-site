const packageJSON = require('./package.json');

const withPlugins = require('next-compose-plugins');
const { patchWebpackConfig } = require('next-global-css');
const nextTranspileModules = require('next-transpile-modules');

let transpiledPackages = [
  '@jetbrains/kotlin-web-site-ui',
  ...(Object.keys(packageJSON.dependencies).filter(it => it.includes('@rescui/'))),
  // transitive deps needed too:
  '@rescui/dropdown'
];

const withTranspile = nextTranspileModules(transpiledPackages);

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    loader: "custom",
    imageSizes: [380, 768, 1280, 2360],
    deviceSizes: [380, 768, 1280, 3840],
    nextImageExportOptimizer: {
      imageFolderPath: "public/images",
      exportFolderPath: "out",
      quality: 90,
    },
  },
  env: {
    storePicturesInWEBP: false,
  },
  webpack: (config, options) => {
    patchWebpackConfig(config, options);

    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'yaml-loader'
    });

    config.module.rules.push({
      test: /\.mustache$/,
      loader: 'mustache-loader'
    })

    return config
  },
};

module.exports = withPlugins([
  [withTranspile]
], nextConfig);
