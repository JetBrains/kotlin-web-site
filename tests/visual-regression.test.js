const Path = require('path');
const fs = require('fs');
const utils = require('./utils');

const captureSelector = '.page-content';
const baseUrl = browser.options.baseUrl;
const report = [];
const getDiffFilename = utils.screenshotNameGenerator(utils.getVisualRegressionDirs().diff);

const args = utils.getCLIArgs();
if (!args.paths) {
  throw new Error('--paths=filepath.txt option should be provided');
}
const paths = utils.readFilesToArray(args.paths);

describe('Visual regression', () => {
  paths.forEach(path => {
    it(path, () => {
      const url = baseUrl + path;

      browser.url(path);
      browser.pause(1000);

      const isElementExists = browser.isExisting(captureSelector);
      if (!isElementExists) {
        report.push({
          url,
          path,
          type: 'element_not_found',
          selector: captureSelector
        });
        throw new Error(`${captureSelector} not found at ${url}`);
      }

      const results = browser.checkElement(captureSelector);

      results.forEach((result) => {
        const {isExactSameImage, misMatchPercentage} = result;
        const msg = `Mismatch percentage - ${misMatchPercentage}`;

        if (!isExactSameImage) {
          report.push({
            url,
            path,
            type: 'regression',
            amount: misMatchPercentage
          });
          throw new Error(`Screenshots mismatched by ${misMatchPercentage}%`);
        }
      });
    });
  });

  after(() => {
    if (report.length === 0) {
      return;
    }

    const reportFilepath = Path.resolve(__dirname, '../visual-regression-report/report.html');
    const regressions = report.filter(item => item.type === 'regression');
    const notFounds = report.filter(item => item.type === 'element_not_found');

    const regressionsStr = `<h3>Regressions</h3>
<ul>
${regressions.map(({url, path, amount}) => {
      return `<li><a href="${url}">${path}</a> ${amount}% mismatch [<a href="diff${path}.png">diff image</a>]</li>`;
    })}
</ul>`;

    const notFoundsStr = `<h3>Element not found errors (${captureSelector})</h3>
<ul>
${notFounds.map(({url, path}) => {
      return `<li><a href="${url}">${path}</a></li>`;
    })}
</ul>`;

    const result = `<!DOCTYPE html><html>
<head><meta charset="UTF-8"></head>
<body>
<h1>${baseUrl}</h1>
${regressions.length > 0 ? regressionsStr : ''}
${notFounds.length > 0 ? notFoundsStr : ''}
</body>
</html>`;

    fs.writeFileSync(reportFilepath, result, 'utf-8');
  });
});