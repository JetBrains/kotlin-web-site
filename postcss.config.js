module.exports = ({ file, options, env }) => ({
  sourceMap: true,
  plugins: {
    'autoprefixer': { browsers: ['last 2 versions'] },
  }
});