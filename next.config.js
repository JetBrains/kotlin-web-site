const path = require('path');
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

if (process.env.USE_FALLBACK_FOR_INTERNAL_PACKAGES !== '1') {
    transpiledPackages.push(
        '@webteam/youtube-playlist',
        '@webteam/ui-contexts',
        '@webteam/colors',
        '@webteam/toggle',
        '@webteam/youtube-player',
        '@webteam/use-fetch',
        '@webteam/use-async-data',
        '@webteam/bem-cn-fast',
        '@webteam/list'
    )
}

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

        config.module.rules.push({
            test: /\.md$/,
            type: 'asset/source'
        });

        const useFallbackForInternalPackages = process.env.USE_FALLBACK_FOR_INTERNAL_PACKAGES === '1';

        config.resolve.alias = config.resolve.alias || {};

        if (useFallbackForInternalPackages) {
            config.resolve.alias['@webteam'] = path.resolve(
                __dirname,
                'components/webteam-fallback'
            );
        }

        return config;
    },
};

module.exports = withPlugins([[withTranspile], [optimizedImages]], nextConfig);
