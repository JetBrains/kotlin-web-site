if (typeof ui === 'undefined') {
    var ui = {};
}

if (typeof ui.pages === 'undefined') {
    ui.pages = {};
}

ui.pages.index = {};

ui.pages.index.featuresRotator = {
    _interval: null,

    _currentHalf: null,

    init: function() {
        var that = this,
            $listWrap = $('.kotlin-features-list-wrap'),
            $list = $listWrap.find('.js-features-list'),
            extraSpace,
            windowWidth = $(window).width(),
            listWrapHalfWidth = Math.round(windowWidth / 2);

        return;

        if (windowWidth > $list.width()) {
            return;
        }

        extraSpace = Math.round(($list.width() - windowWidth) / 2);
        console.log(extraSpace);

        $listWrap.on('mousemove', function(e) {
            var half,
                m;

            half = (e.pageX > listWrapHalfWidth) ? 'right' : 'left';
            that._currentHalf = half;
        });

        $listWrap.on('mouseenter', function(e) {
            that._createAnimation($list, {
                maxValue: extraSpace
            });
        });

        $listWrap.on('mouseleave', function(e) {
            that._destroyAnimation();
        });
    },

    _createAnimation: function($obj, opts) {
        var that = this,
            half = that._currentHalf,
            maxValue = opts.maxValue,
            value;

        that._interval = setInterval(function() {
            var value = parseInt($obj.css('left')),
                half = that._currentHalf,
                futureValue = (half === 'right') ? value-2 : value+2;

            if (futureValue > -maxValue && futureValue < maxValue) {
                //value += (half === 'right') ? -1 : 1;
                $obj.css('left', futureValue);
            }
        }, 1);
    },

    _destroyAnimation: function() {
        var that = this;
        clearInterval(that._interval);
    },

    _doAnimation: function() {
        var that = this;
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
            $videoPlayerWrap = $('.js-video-player-wrap');

        $videoPlayerWrap.find('.js-video-thumb').on('click', function(e) {
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
                    .html('<iframe width="100%" height="540" src="'+ videoEmbedUrl +'" frameborder="0" allowfullscreen></iframe>')
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