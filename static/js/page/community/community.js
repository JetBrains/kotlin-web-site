require('./community.scss');
var AOS = require('aos');
var $ = require('jquery');

function setHoverState(id, hover) {
  var $imgElement = $('.all-speak-kotlin_img');
  $("[data-svg-id='" + id + "'] > a").toggleClass('_hover', hover);
  $imgElement.find('#' + id + ' .hover').toggle(hover);
  $imgElement.find('#' + id + ' .default').toggle(!hover);
}

function setAnimation(id, animation) {
  var linkElement = document.querySelector('[data-svg-id="' + id + '"]');
  var svgElement = document.getElementById(id);

  if (linkElement) {
    linkElement.setAttribute('data-aos', animation + "_link");
    linkElement.setAttribute('data-aos-anchor', ".all-speak-kotlin");
    linkElement.setAttribute('data-aos-anchor-placement', "top-center");
  }

  svgElement.setAttribute('data-aos', animation);
  svgElement.setAttribute('data-aos-anchor', ".all-speak-kotlin");
  svgElement.setAttribute('data-aos-anchor-placement', "top-center");
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
    });


    $('.all-speak-kotlin_link-button').on('mouseenter', function () {
      setHoverState(this.parentNode.getAttribute('data-svg-id'), true)
    }).on('mouseleave', function () {
      setHoverState(this.parentNode.getAttribute('data-svg-id'), false)
    });

    setAnimation("talking_kotlin", "anim1");
    setAnimation("reddit", "anim2");
    setAnimation("slack", "anim3");
    setAnimation("linkedin", "anim4");
    setAnimation("Layer_3", "anim5");
    setAnimation("Layer_2", "anim5");
    setAnimation("kotlin_talks", "anim5");
    setAnimation("Layer_6", "anim6");
    setAnimation("Layer_7", "anim7");
    setAnimation("Layer_8", "anim8");
    setAnimation("kotlin_forum", "anim9");
    setAnimation("Layer_4", "anim9");
    setAnimation("Layer_5", "anim9");
    setAnimation("stackoverflow", "anim10");
    setAnimation("twitter", "anim11");
    setAnimation("google", "anim12");
    setAnimation("klink", "anim13");

    AOS.init({
      duration: 500
    });
  });
});