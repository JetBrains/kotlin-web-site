import kotlinPlayground from 'kotlin-playground';
import $ from 'jquery';
import 'whatwg-fetch';
import '../com/search/search';
import '../com/cities-banners';
import GifPlayer from '../com/gif-player/gif-player';
import CodeMirror from '../com/codemirror/CodeMirror';
import './code-blocks'
import '../com/head-banner';

$(document).ready(function () {
  kotlinPlayground('.sample');

  CodeMirror.colorize($('.code._highlighted'));

  const html = document.getElementsByTagName('html')[0];

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
    const id = this.getAttribute("id");
    if (id == null) return;
    const referenceElement = document.createElement("a");
    referenceElement.className = "anchor";
    referenceElement.href = "#" + id;
    this.appendChild(referenceElement);
  });
  const elements = document.getElementsByClassName("gif-image");
  Array.prototype.forEach.call(elements, function(el) {
    new GifPlayer(el)
  });
});