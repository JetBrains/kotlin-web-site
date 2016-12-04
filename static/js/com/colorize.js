var CodeMirror = require('codemirror');
require('codemirror/addon/runmode/colorize.js');

require('codemirror/mode/clike/clike.js');
require('codemirror/mode/groovy/groovy.js');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/shell/shell.js');

var $ = require('jquery');

$(document).ready(function () {
  CodeMirror.colorize($('.code._highlighted'))
});