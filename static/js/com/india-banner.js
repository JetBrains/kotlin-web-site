var $ = require('jquery');
var bannersRotator = require('../com/banners-rotator');

const INDIA_CODE = "IN";

$(document).ready(function () {

  initIndiaBunner();

  function initIndiaBunner() {
    $.ajax({
      url: "https://data.services.jetbrains.com/geo",
    }).done(function (data) {
      if (data.code === INDIA_CODE) {
        let template = '<a class="link-meetup-india" href="https://info.jetbrains.com/JetBrains-Team-India-2018.html"></a>'
        bannersRotator.createBanner({
          id: 'india',
          type: bannersRotator.Banner.TYPE.slideup,
          width: 'auto',
          height: 'auto',
          template: template,
          className: 'india-meetup-banner'
        });
      }
    });
  }

});

