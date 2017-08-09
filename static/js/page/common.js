import '../com/search/search';
require('whatwg-fetch');
require('../com/cookie-banner');
const CodeMirror = require('../com/codemirror/CodeMirror');
const NavTree = require('../com/nav-tree');
const ExecutableCode = require('../com/executable-code');
const $ = require('jquery');

$(document).ready(function () {
  new ExecutableCode('.sample');

  CodeMirror.colorize($('.code._highlighted'));

  var html = document.getElementsByTagName('html')[0];

  html.className = html.className.replace('no-js', '');

  // OS detection
  if (navigator.userAgent.indexOf('Linux') > -1)
    html.className += ' os_linux';

  // Browser detection
  if ('chrome' in window)
    html.className += ' ua_chrome';
  else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
    html.className += ' ua_firefox';

  // hack to force :active support in mobile Safari
  document.addEventListener("touchstart", function () {
  }, false);

  $('h1,h2,h3').each(function (element) {
    var id = this.getAttribute("id");
    if (id == null) return;
    var referenceElement = document.createElement("a");
    referenceElement.className = "anchor";
    referenceElement.href = "#" + id;
    this.appendChild(referenceElement);
  });

  var sideTreeElement = document.querySelector('.js-side-tree-nav');
  if (sideTreeElement) {
    new NavTree(sideTreeElement);
  }
});