const fs = require('fs');
const path = require('path');

const packageJSON = require('./package.json');

const { patchWebpackConfig } = require('next-global-css');

let transpiledPackages = [
    '@jetbrains/kotlin-web-site-ui',
    ...Object.keys(packageJSON.dependencies).filter((it) => it.includes('@rescui/')),
    // transitive deps needed too:
    '@rescui/dropdown',
    '@rescui/menu',
    '@rescui/radio-button',
    '@rescui/rate',
    '@rescui/select',
    '@rescui/textarea',
    '@rescui/form-field',
    '@rescui/use-resize-observer',
    '@webteam/youtube-playlist',
    '@webteam/colors',
    '@webteam/toggle',
    '@webteam/youtube-player',
    '@webteam/use-fetch',
    '@webteam/use-async-data',
    '@webteam/bem-cn-fast',
    '@webteam/list',
    '@webteam/video-player',
    '@webteam/forms',
    '@webteam/error-boundary',
    '@webteam/layout',
    '@webteam/breakpoints',
    '@webteam/data-services',
    '@webteam/promise-cache',
    '@webteam/file-uploader',
    '@webteam/client-traits',
    '@webteam/country-select',
    '@webteam/postcard-section',
    '@webteam/social-share',
    '@webteam/article',
    '@webteam/horizontal-barchart',
    '@webteam/pie-chart',
    '@webteam/chart-core-v3'
];

// Check packages exist (not installed when optional @webteam/* deps are omitted)
transpiledPackages = transpiledPackages.filter((name) =>
    fs.existsSync(path.join(__dirname, 'node_modules', name, 'package.json'))
);

const nextConfig = {
    output: 'export',

    transpilePackages: transpiledPackages,

    pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

    images: {
        unoptimized: true,
    },

    trailingSlash: true,

    webpack: (config, options) => {
        patchWebpackConfig(config, options);

        config.module.rules.push({
            test: /\.ya?ml$/,
            use: 'yaml-loader',
        });

        config.module.rules.push({
            test: /\.md$/,
            type: 'asset/source'
        });

        config.module.rules.push({
            test: /\.(webm|mp4)$/,
            type: 'asset/resource',
            generator: {
                filename: 'static/media/[name].[hash][ext]',
            },
        });

        return config;
    },
};

module.exports = nextConfig;
