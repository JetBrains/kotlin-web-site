require('./community.scss');
var $ = require('jquery');

function getSvgId(element) {
  var svgId = null;
  element.classList.forEach(function (className) {
    if (className.startsWith('_')) {
      svgId = className.substring(1).replace(/-/g, '_')
    }
  });
  return svgId;
}

function processSvgElementHover(element, hover) {
  var svgId = getSvgId(element);
  var $imgElement = $('.all-speak-kotlin_img');
  $imgElement.find('#' + svgId + ' .hover').toggle(hover);
  $imgElement.find('#' + svgId + ' .default').toggle(!hover);
}

$(document).ready(function () {
  $.ajax({
    url: '/assets/images/all_speak_kotlin.svg',
    dataType: 'xml'
  }).success(function (data) {
    var svgElement = data.documentElement;
    $(svgElement).find('g').each(function (index, element) {
      var id = element.getAttribute('id');
      if (id == null) return;
      if (id.endsWith('_default')) {
        element.removeAttribute('id');
        element.setAttribute('class', 'default')
      } else if (id.endsWith('_hover')) {
        element.removeAttribute('id');
        element.setAttribute('class', 'hover');
        element.setAttribute('display', 'none');
      }
    });
    $('.all-speak-kotlin_img').append(data.documentElement)
  });

  $('.all-speak-kotlin_link-button').on('mouseenter', function () {
    processSvgElementHover(this.parentNode, true)
  }).on('mouseleave', function () {
    processSvgElementHover(this.parentNode, false)
  });
});