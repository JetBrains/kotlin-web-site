import $ from "jquery";

const BANNER_KEY = 'kotlin-kmm-survey-2020';

$(document).ready(() => {
  const isClosed = window.localStorage.getItem(BANNER_KEY);
  if (!isClosed) {
    const $banner = $('.banner-nav');
    $banner.css("display", "block");
    const searchButton = $('.close-head-banner');
    searchButton.on('click touch', closeBanner);
  }

  function closeBanner() {
    const $banner = $('.banner-nav');
    $banner.css("display", "none");
    window.localStorage.setItem(BANNER_KEY, "true");
  }
});
