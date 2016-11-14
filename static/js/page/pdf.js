require('pdf.scss');
const CodeMirror = require('../com/CodeMirror');

const $ = require('jquery');

$(document).ready(function () {
  CodeMirror.colorize($('.code._highlighted'))
});
