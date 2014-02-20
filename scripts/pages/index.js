if (typeof ui === 'undefined') {
    var ui = {};
}

if (typeof ui.pages === 'undefined') {
    ui.pages = {};
}

ui.pages.index = {};

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
                    $tabContentNode.show();
                } else {
                    $currentTab.removeClass('is_active');
                    $tabContentNode.hide();
                }
            });
        });
    }
};

ui.pages.index.videoPlayer = {
    init: function() {
        var $videoPlayerWrap = $('.js-video-player-wrap');

        $videoPlayerWrap.find('.js-video-thumb').on('click', function(e) {
            var $thumb = $(this),
                videoId = this.href.match(/\?v=([^&]*)/);

            e.preventDefault();

            if (videoId === null) {
                return;
            }

            videoId = videoId[1];
            console.log(videoId);

            $videoPlayerWrap.addClass('is_showing-video');

            setTimeout(function() {
                $thumb.remove();
                $videoPlayerWrap
                    .find('.js-video-player')
                    .html('<iframe width="100%" height="540" src="//www.youtube.com/embed/'+ videoId +'?autoplay=1" frameborder="0" allowfullscreen></iframe>')
                    .show();
            }, 400);
        });
    }
};