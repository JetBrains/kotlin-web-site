require('./community.scss');
var $ = require('jquery');

function setHoverState(id, hover) {
  var $imgElement = $('.all-speak-kotlin_img');
  $("[data-svg-id='" + id + "'] > a").toggleClass('_hover', hover);
  $imgElement.find('#' + id + ' .hover').toggle(hover);
  $imgElement.find('#' + id + ' .default').toggle(!hover);
}

$(document).ready(function () {
  $.ajax({
    url: '/assets/images/all_speak_kotlin.svg',
    dataType: 'xml'
  }).success(function (data) {
    var svgElement = data.documentElement;
    var $imgElement = $('.all-speak-kotlin_img');
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
    $imgElement.append(data.documentElement);

    $imgElement.find('g.hover').parent().on('click', function () {
      var href = $('[data-svg-id="' + this.getAttribute('id') + '"] > a').attr('href');
      window.open(href);
    }).on('mouseenter', function () {
      setHoverState(this.getAttribute('id'), true)
    }).on('mouseleave', function () {
      setHoverState(this.getAttribute('id'), false)
    })
  });

  $('.all-speak-kotlin_link-button').on('mouseenter', function () {
    setHoverState(this.parentNode.getAttribute('data-svg-id'), true)
  }).on('mouseleave', function () {
    setHoverState(this.parentNode.getAttribute('data-svg-id'), false)
  });


});