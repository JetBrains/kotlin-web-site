import $ from "jquery";

$(document).ready(() => {
  const searchButton = $('.close-head-banner');
  searchButton.on('click touch', closeBanner);

  function closeBanner() {
    const $banner = $('.banner-nav');
    $banner.css("display", "none");
  }
});