/* eslint-disable import/no-dynamic-require,prefer-template,comma-dangle */

const babelRc = {
  extends: './../../.babelrc',
  extensions: ['.mjs', '.js', '.jsx'],
  ignore: [],
  plugins: [
    [
      "babel-plugin-transform-import-ignore",
      {
        "patterns": [/\.s?css$/]
      }
    ],
    fixCoreJSPath
  ]
};

require('@babel/register')(babelRc);
require('./compile.mjs')['default']();

function fixCoreJSPath() {
  return {
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source;

        if (/@babel\/runtime-corejs3\/helpers\/esm/.test(source.value)) {
          path.node.source.value = source.value.replace('/esm/', '/');
        }
      }
    }
  };
}
