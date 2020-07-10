const $ = require('jquery');
const bannersRotator = require('../com/banners-rotator');

const COUNTRY_CODE = null;
const LINK = null;

$(function () {
  function initBanners() {
    $.ajax({ url: "https://data.services.jetbrains.com/geo" }).done(function (data) {
      if (COUNTRY_CODE && data.code === COUNTRY_CODE) {
        let template = `<a class="link-banner_pl" href="${LINK}"></a>`;
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

  initBanners();
});