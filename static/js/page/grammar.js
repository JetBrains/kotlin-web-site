var Toc = require('../com/toc');

var $ = require('jquery');

$(document).ready(function () {
  var toc = new Toc();

  toc.render({
    target: document.getElementById('js-toc')
  });
});