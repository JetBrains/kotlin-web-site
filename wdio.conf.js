const path = require('path');
const utils = require('./tests/utils');
const VisualRegressionCompare = require('wdio-visual-regression-service/compare');

const args = utils.getCLIArgs();
const dirs = utils.getVisualRegressionDirs();

const config = {
  host: 'localhost',
  port: 4444,

  specs: [],
  exclude: [],
  maxInstances: 10,

  // https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
  capabilities: [
    {
      browserName: 'chrome'
    }
  ],

  sync: true,

  // silent | verbose | command | data | result | error
  logLevel: 'silent',

  coloredLogs: true,

  baseUrl: args.baseUrl || 'http://kotlinlang.org',

  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,

  // Default timeout in milliseconds for request if Selenium Grid doesn't send response
  connectionRetryTimeout: 90000,

  // Default request retries count
  connectionRetryCount: 3,

  plugins: {
    'wdio-screenshot': {},
  },

  services: [
    'visual-regression'
  ],

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },

  // http://webdriver.io/guide/testrunner/reporters.html
  reporters: ['spec'],

  // Hooks
  before: function (capabilities, specs) {
    const chai = require('chai');
    chai.should();
  },

  visualRegression: {
    compare: new VisualRegressionCompare.LocalCompare({
      referenceName: utils.screenshotNameGenerator(dirs.reference),
      screenshotName: utils.screenshotNameGenerator(dirs.current),
      diffName: utils.screenshotNameGenerator(dirs.diff),
      misMatchTolerance: 0.01,
    }),
    viewportChangePause: 300,
    widths: [1280],
    orientations: ['landscape'],
  },
};

exports.config = config;