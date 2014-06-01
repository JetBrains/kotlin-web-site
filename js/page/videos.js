define(['jquery'], function($) {

    return function(data) {
        $(document).ready(function() {
            var videoIdRegexp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
                videoEmbedUrl,
                videos,
                categories;

            videos = data.videos;
            categories = data.categories;

            console.log(data)

            initVideos();
            initCategoriesFilter();

            for (var categoryId in categories) {
                if ($('#category_' + categoryId + ' .videos-list-item').length === 0) {
                    $('.nav-item[data-id="' + categoryId + '"]').remove();
                }
            }


            function initVideos() {
                $('.js-video').on('click', function(e) {
                    var $elem = $(this),
                        videoUrl = this.href,
                        match,
                        videoEmbedUrl;

                    e.preventDefault();

                    match = videoUrl.match(videoIdRegexp);
                    if (match !== null && typeof match[7] !== 'undefined') {
                        videoEmbedUrl = 'http://www.youtube.com/embed/' + match[7] + '?autoplay=1&showinfo=0&vq=hd720';
                        $elem.append('<iframe src="'+ videoEmbedUrl +'" class="video-player">');
                    }
                });
            }

            function initCategoriesFilter(categories) {
                var $filter = $('#categories-filter'),
                    $items = $filter.find('.nav-item');

                $items.on('click', function(e) {
                    var activeId = this.getAttribute('data-id'),
                        isActive = $(this).hasClass('is_active');

                    if (isActive) {
                        return false;
                    }

                    $items.each(function() {
                        var id = this.getAttribute('data-id'),
                            $videosElem = $('#category_' + id),
                            $elem = $(this);

                        if (id === activeId) {
                            $elem.addClass('is_active');
                            $videosElem.show();
                        } else {
                            $elem.removeClass('is_active');
                            $videosElem.hide();
                        }
                    })

                });
            }
        });
    };

});