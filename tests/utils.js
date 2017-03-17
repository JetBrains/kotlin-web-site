const path = require('path');
const fs = require('fs');
const parseArgs = require('minimist');

/**
 * @param {String|Array<String>} filenames
 * @param {String} [dir]
 * @returns {Array<String>}
 */
function readFilesToArray(filenames, dir = process.cwd()) {
  const mark = '!!';
  const files = typeof filenames === 'string' ? filenames.split(',') : filenames;

  const paths = files
    .map(name => path.resolve(dir, name))
    .reduce((data, filepath) => {
      const content = fs.readFileSync(filepath, 'utf-8').toString();
      const lines = content.replace(/\r\n/g,'\n').split('\n');
      return data.concat(lines);
    }, [])
    .filter(val => val.trim() !== '')
    .filter((value, index, self) => self.indexOf(value) === index);

  const markedPaths = paths
    .filter(p => p.indexOf(mark) === 0)
    .map(p => p.substr(mark.length));

  return markedPaths.length > 0 ? markedPaths : paths;
}

function getCLIArgs() {
  return parseArgs(process.argv.slice(2));
}

function screenshotNameGenerator(basePath) {
  return function(context) {
    const testName = context.test.title;
    const filename = testName.replace(/^\//, '');
    return path.join(basePath, `${filename}.png`);
  };
}

function getVisualRegressionDirs() {
  return {
    reference: path.join(process.cwd(), 'visual-regression-report/reference'),
    current: path.join(process.cwd(), 'visual-regression-report/current'),
    diff: path.join(process.cwd(), 'visual-regression-report/diff'),
  }
}

module.exports.readFilesToArray = readFilesToArray;
module.exports.getCLIArgs = getCLIArgs;
module.exports.screenshotNameGenerator = screenshotNameGenerator;
module.exports.getVisualRegressionDirs = getVisualRegressionDirs;