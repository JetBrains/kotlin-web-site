const $ = require('jquery');
const bannersRotator = require('../com/banners-rotator');

const COUNTRY_CODE = "PL";

const COUNTRY_LINK = "https://info.jetbrains.com/jetbrains-trip-poland-2019.html";

$(document).ready(function () {

  initBanners();

  function initBanners() {
    $.ajax({
      url: "https://data.services.jetbrains.com/geo",
    }).done(function (data) {
      if (data.code === COUNTRY_CODE) {
        let template = `<a class="link-banner" href="${COUNTRY_LINK}"></a>`;
        bannersRotator.createBanner({
          id: "banner-default-country",
          type: bannersRotator.Banner.TYPE.slideup,
          width: 'auto',
          height: 'auto',
          template: template,
          className: 'link-banner'
        });
      }
    });
  }

});