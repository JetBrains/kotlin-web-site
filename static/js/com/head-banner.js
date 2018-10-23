import $ from "jquery";

const KC_KEY = 'kotlin-conf-2018';

$(document).ready(() => {
  const isClosed = window.localStorage.getItem(KC_KEY);
  if (!isClosed) {
    const $banner = $('.banner-nav');
    $banner.css("display", "block");
    const searchButton = $('.close-head-banner');
    searchButton.on('click touch', closeBanner);
  }

  function closeBanner() {
    const $banner = $('.banner-nav');
    $banner.css("display", "none");
    window.localStorage.setItem(KC_KEY, "true");
  }
});