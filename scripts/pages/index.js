if (typeof ui === 'undefined') {
    var ui = {};
}

if (typeof ui.pages === 'undefined') {
    ui.pages = {};
}

ui.pages.index = {};

ui.pages.index.featuresCarousel = {
    init: function() {
        var that = this,
            $wrapElem = $('#features-carousel'),
            $elem = $wrapElem.find('.js-carousel');

        $elem.jcarousel({
            list: '.kotlin-features-list'
        });

        $wrapElem.find('.js-carousel-nav-prev')
            .jcarouselControl({
                target: '-=1'
            })
            .on('jcarouselcontrol:active', function () {
                $(this).removeClass('is_disabled');
            })
            .on('jcarouselcontrol:inactive', function () {
                $(this).addClass('is_disabled');
            });

        $wrapElem.find('.js-carousel-nav-next')
            .jcarouselControl({
                target: '+=1'
            })
            .on('jcarouselcontrol:active', function () {
                $(this).removeClass('is_disabled');
            })
            .on('jcarouselcontrol:inactive', function () {
                $(this).addClass('is_disabled');
            });
    }
};

ui.pages.index.testimonialsCarousel = {
    init: function() {
        var that = this,
            $wrapElem = $('#testimonials-carousel-wrap'),
            $elem = $wrapElem.find('.js-carousel');

        $elem.jcarousel({
            list: '.testimonials-list'
        });

        $wrapElem.find('.js-carousel-nav-prev')
            .jcarouselControl({
                target: '-=1'
            })
            .on('jcarouselcontrol:active', function () {
                $(this).removeClass('is_disabled');
            })
            .on('jcarouselcontrol:inactive', function () {
                $(this).addClass('is_disabled');
            });

        $wrapElem.find('.js-carousel-nav-next')
            .jcarouselControl({
                target: '+=1'
            })
            .on('jcarouselcontrol:active', function () {
                $(this).removeClass('is_disabled');
            })
            .on('jcarouselcontrol:inactive', function () {
                $(this).addClass('is_disabled');
            });
    }
};

ui.pages.index.tabs = {
    init: function() {
        var $tabs = $('.js-tab');

        $tabs.on('click', function() {
            var $tab = $(this),
                tabId = $tab.attr('data-tab-id');

            if ($tab.hasClass('is_active')) {
                return;
            }

            $tabs.each(function() {
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
    }
};

ui.pages.index.videoPlayer = {
    VIDEO_EMBED_URL: '//www.youtube.com/embed/{video_id}?autoplay=1',

    init: function() {
        var that = this,
            $videoPlayerWrap = $('.js-video-player-wrap'),
            videoHeight = $videoPlayerWrap.height();

        $videoPlayerWrap.css('height', videoHeight);

        $videoPlayerWrap.find('.js-video-thumb-link').on('click', function(e) {
            var $thumb = $(this),
                videoId = this.href.match(/\?v=([^&]*)/),
                videoEmbedUrl;

            e.preventDefault();

            if (videoId === null) {
                return;
            }

            videoId = videoId[1];
            videoEmbedUrl = that.VIDEO_EMBED_URL.replace('{video_id}', videoId) + '&vq=hd720';
            $videoPlayerWrap.addClass('is_showing-video');

            setTimeout(function() {
                $thumb.remove();
                $videoPlayerWrap
                    .find('.js-video-player')
                    .html('<iframe width="100%" height="'+ videoHeight +'" src="'+ videoEmbedUrl +'" frameborder="0" allowfullscreen></iframe>')
                    .show();
            }, 400);
        });
    }
};

ui.pages.index.popups = {
    init: function() {
        var that = this,
            $popups = $('.js-popup'),
            $popupShowButtons = $('.js-popup-open-button'),
            $popupHideButtons = $('.js-popup-close-button');

        $popupShowButtons.on('click', function(e) {
            var popupId = this.getAttribute('data-popup-id');

            e.stopPropagation();
            that.showPopup(popupId);
        });

        $popupHideButtons.on('click', function(e) {
            var popupId = this.getAttribute('data-popup-id');

            e.stopPropagation();
            that.hidePopup(popupId);
        });

        $(document.body).on('click', function() {
            $popups.each(function() {
                var $popup = $(this),
                    popupId = this.id;

                if (!$popup.hasClass('_hidden')) {
                    that.hidePopup(popupId);
                }
            });
        });

        $popups.on('click', function(e) {
            e.stopPropagation();
        })
    },

    togglePopup: function(id) {
        var that = this,
            $popupNode = $('#' + id);

        if ($popupNode.hasClass('_hidden')) {
            that.showPopup(id);
        } else {
            that.hidePopup(id);
        }
    },

    showPopup: function(id) {
        var $popupNode = $('#' + id);

        $popupNode.removeClass('_hidden');
    },

    hidePopup: function(id) {
        var $popupNode = $('#' + id);

        $popupNode.addClass('_hidden');
    }
};