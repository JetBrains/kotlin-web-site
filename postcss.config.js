module.exports = {
  plugins: [
    require('autoprefixer')({ browsers: ['last 2 versions'] }),
    process.env.NODE_ENV === 'production' && require('cssnano')()
  ].filter(Boolean)
};