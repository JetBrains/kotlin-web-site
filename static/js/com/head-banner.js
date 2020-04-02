import $ from "jquery";

const BANNER_KEY = 'kotlin-global-banner';

$(() => {
  const $bannerContainer = $('.banner-container');
  let bannerKey = $bannerContainer.data('banner-id') || BANNER_KEY;

  const isClosed = window.localStorage.getItem(bannerKey);

  if (!isClosed) {
    const $banner = $bannerContainer.closest('.banner-nav');

    $bannerContainer.on('click touch', $bannerContainer, function closeBanner() {
      const $banner = $('.banner-nav');
      $banner.css("display", "none");
      window.localStorage.setItem(bannerKey, "true");
    });

    $banner.css("display", "block");
  }
});