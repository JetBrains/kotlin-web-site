define([
    'jquery',
    'com/carousel',
    'com/video-player'
], function ($, Carousel, Player) {

    var initTabs = function () {
        var $tabs = $('.js-tab');

        $tabs.on('click', function () {
            var $tab = $(this),
                tabId = $tab.attr('data-tab-id');

            if ($tab.hasClass('is_active')) {
                return;
            }

            $tabs.each(function () {
                var $currentTab = $(this),
                    currentTabId = $currentTab.attr('data-tab-id'),
                    $tabContentNode = $('#' + currentTabId);

                if (tabId === currentTabId) {
                    $currentTab.addClass('is_active');
                    $tabContentNode.removeClass('is_hidden');
                } else {
                    $currentTab.removeClass('is_active');
                    $tabContentNode.addClass('is_hidden');
                }
            });
        });
    };

    var initPopups = function () {
        var popups =
        {
            init: function () {
                var that = this,
                    $popups = $('.js-popup'),
                    $popupShowButtons = $('.js-popup-open-button'),
                    $popupHideButtons = $('.js-popup-close-button');

                $popupShowButtons.on('click', function (e) {
                    var popupId = this.getAttribute('data-popup-id');

                    e.stopPropagation();
                    that.showPopup(popupId);
                });

                $popupHideButtons.on('click', function (e) {
                    var popupId = this.getAttribute('data-popup-id');

                    e.stopPropagation();
                    that.hidePopup(popupId);
                });

                $(document.body).on('click', function () {
                    $popups.each(function () {
                        var $popup = $(this),
                            popupId = this.id;

                        if (!$popup.hasClass('_hidden')) {
                            that.hidePopup(popupId);
                        }
                    });
                });

                $popups.on('click', function (e) {
                    e.stopPropagation();
                })
            },

            togglePopup: function (id) {
                var that = this,
                    $popupNode = $('#' + id);

                if ($popupNode.hasClass('_hidden')) {
                    that.showPopup(id);
                } else {
                    that.hidePopup(id);
                }
            },

            showPopup: function (id) {
                var $popupNode = $('#' + id);

                $popupNode.removeClass('_hidden');
            },

            hidePopup: function (id) {
                var $popupNode = $('#' + id);

                $popupNode.addClass('_hidden');
            }
        };

        popups.init();
    };

    var initPlayer = function () {
        var $playerBlock = $('.js-video-player-wrap'),
            $playerPlaceholder = $playerBlock.find('.js-video-player'),
            $thumbLink = $playerBlock.find('.js-video-thumb-link'),
            playerHeight = $playerBlock.get(0).offsetHeight;

        $playerBlock.css('height', playerHeight);

        $thumbLink.on('click', function (e) {
            var $thumbLink = $(this),
                videoId = Player.getVideoIdFromUrl(this.href);

            if (!videoId) {
                return;
            }

            $playerBlock.addClass('is_showing-video');

            setTimeout(function () {
                $thumbLink.remove();
                new Player($playerPlaceholder.get(0), {
                    width: '100%',
                    height: playerHeight,
                    videoId: videoId,
                    autoPlay: true
                });

            }, 400);

            e.preventDefault();
        });
    };

    return (function () {
        $(document).ready(function () {
            // Features carousel
            new Carousel({
                elem: document.getElementById('features-carousel-wrap')
            });

            // Testimonials carousel
            new Carousel({
                elem: document.getElementById('testimonials-carousel-wrap')
            });

            initPlayer();
            initPopups();
            initTabs();
        });
    })();

});