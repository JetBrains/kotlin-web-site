const packageJSON = require('./package.json');

const withPlugins = require('next-compose-plugins');
const { patchWebpackConfig } = require('next-global-css');
const nextTranspileModules = require('next-transpile-modules');
const optimizedImages = require('next-optimized-images');

let transpiledPackages = [
    '@jetbrains/kotlin-web-site-ui',
    ...Object.keys(packageJSON.dependencies).filter((it) => it.includes('@rescui/')),
    // transitive deps needed too:
    '@rescui/dropdown',
];

const withTranspile = nextTranspileModules(transpiledPackages);

const nextConfig = {
    output: 'export',

    pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

    images: {
        unoptimized: true,
        disableStaticImages: true,
    },

    trailingSlash: true,

    eslint: {
        dirs: ['blocks', 'components', 'pages'],
    },

    webpack: (config, options) => {
        patchWebpackConfig(config, options);

        config.module.rules.push({
            test: /\.ya?ml$/,
            use: 'yaml-loader',
        });

        return config;
    },
};

module.exports = withPlugins([[withTranspile], [optimizedImages]], nextConfig);
