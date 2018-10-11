const $ = require('jquery');
const bannersRotator = require('../com/banners-rotator');

const COUNTRIES_CODES = {
  JAPAN: 'JP',
  CHINA: 'CN',
  VIETNAM: 'VN',
  S_KOREA: 'KR',
  SINGAPORE: 'SG'
};

const COUNTRIES_ID = {
  DEFAULT: 'banner-default-country',
  S_KOREA: 'banner-seul-country',
  VIETNAM: 'banner-hanoi-country',
  CHINA: 'banner-china-country'
};

const COUNTRIES_LINKS = {
  JAPAN: 'https://info.jetbrains.com/jetbrains-night-tokyo-2018.html',
  CHINA: 'https://info.jetbrains.com/jetbrains-china-roadshow-2018.html',
  VIETNAM: 'https://info.jetbrains.com/jetbrains-night-hanoi-2018.html',
  S_KOREA: 'https://jetbrains.tangunsoft.com/_kr/jetbrains-day-seoul-2018/',
  SINGAPORE: 'https://info.jetbrains.com/jetbrains-night-singapore-2018.html'
};

$(document).ready(function () {

  initBanners();

  function initBanners() {
    $.ajax({
      url: "https://data.services.jetbrains.com/geo",
    }).done(function (data) {
      switch (data.code) {
        case COUNTRIES_CODES.CHINA: {
          setBanner(COUNTRIES_LINKS.CHINA, COUNTRIES_CODES.CHINA, COUNTRIES_ID.CHINA)
        }
          break;
        case COUNTRIES_CODES.JAPAN: {
          setBanner(COUNTRIES_LINKS.JAPAN, COUNTRIES_CODES.JAPAN, COUNTRIES_ID.DEFAULT)
        }
          break;
        case COUNTRIES_CODES.S_KOREA: {
          setBanner(COUNTRIES_LINKS.S_KOREA, COUNTRIES_CODES.S_KOREA, COUNTRIES_ID.S_KOREA)
        }
          break;
        case COUNTRIES_CODES.SINGAPORE: {
          setBanner(COUNTRIES_LINKS.SINGAPORE, COUNTRIES_CODES.SINGAPORE, COUNTRIES_ID.DEFAULT)
        }
          break;
        case COUNTRIES_CODES.VIETNAM: {
          setBanner(COUNTRIES_LINKS.VIETNAM, COUNTRIES_CODES.VIETNAM, COUNTRIES_ID.VIETNAM)
        }
          break;
        default:
          return;
      }
    });
  }

  function setBanner(link, country, id) {
    let template = `<a class="link-banner ${country}" href="${link}"></a>`;
    bannersRotator.createBanner({
      id: id,
      type: bannersRotator.Banner.TYPE.slideup,
      width: 'auto',
      height: 'auto',
      template: template,
      className: 'link-banner'
    });
  }

});