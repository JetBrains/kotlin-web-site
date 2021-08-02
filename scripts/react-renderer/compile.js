/* eslint-disable import/no-dynamic-require,prefer-template,comma-dangle */
const babelRc = Object.assign({}, require('./.babelrc.json'), {
    cache: true,
    extensions: ['.mjs', '.js', '.jsx'],
    ignore: [],
});

require('@babel/register')(babelRc);
require('./compile.mjs')['default']();
