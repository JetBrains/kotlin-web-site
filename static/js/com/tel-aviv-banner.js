var $ = require('jquery');
var bannersRotator = require('../com/banners-rotator');
const ISRAEL_CODE = "IL";

$(document).ready(function () {

  initIndiaBunner();

  function initIndiaBunner() {
    $.ajax({
      url: "https://data.services.jetbrains.com/geo",
    }).done(function (data) {
      if (data.code === ISRAEL_CODE) {
        let template = '<a class="link-meetup-tel-aviv" href="https://info.jetbrains.com/jetbrains-night-tel-aviv-2018.html"></a>';
        bannersRotator.createBanner({
          id: 'tel-aviv',
          type: bannersRotator.Banner.TYPE.slideup,
          width: 'auto',
          height: 'auto',
          template: template,
          className: 'tel-aviv-meetup-banner'
        });
      }
    });
  }

});