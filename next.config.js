const packageJSON = require('./package.json');

const { withGlobalCss } = require('next-global-css');
const withConfigCss = withGlobalCss();

let transpiledPackages = [
  '@jetbrains/kotlin-web-site-ui',
  ...(Object.keys(packageJSON.dependencies).filter(it => it.includes('@rescui/')))
];

const withTranspile = require('next-transpile-modules')(transpiledPackages);

module.exports = withTranspile(withConfigCss({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  inlineImageLimit: 0
}));
