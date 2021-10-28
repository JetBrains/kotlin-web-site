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
    ]
  ]
};

require('@babel/register')(babelRc);
require('./compile.mjs')['default']();
