define([
    'jquery',
    'com/nav-tree',
    'com/video-player'
], function ($, NavTree, Player) {

    NavTree.prototype.templates.leafItem = function (item) {
        var hasUrl = 'url' in item,
            hasDuration = 'duration' in item,
            hasDescription = 'description' in item,
            isExternal = hasUrl && Player.getVideoIdFromUrl(item.url) === null,
            itemClassNames,
            itemLinkClassNames,
            attrs = {};

        itemClassNames = ['tree-item', 'tree-leaf', 'js-item', 'js-leaf', 'video-item'];
        itemLinkClassNames = ['tree-item-title', 'tree-leaf-title', 'js-item-title', 'js-leaf-title', 'video-item-title'];

        if (isExternal)
            itemLinkClassNames.push('is_external');

        if (hasUrl) {
            attrs['href'] = item.url;
        }

        if (hasDescription) {
            attrs['data-description'] = item.description;
        }

        var t =
            ['.' + itemClassNames.join('.'),
                [
                    (hasUrl ? 'a.' : 'div.') + itemLinkClassNames.join('.'), attrs,
                    ['span.marker'],
                    ['span.text', item.title],
                    hasDuration
                        ? ['span.duration', item.duration]
                        : null
                ]
            ];

        return t;
    };

    function VideoGallery(elem, config) {

        var tree = new NavTree(elem, {data: config.data});

        var player = new Player(config.playerElem, {
            width: '100%',
            height: 480,
            videoId: 'viiDaLpPfN4'
        });

        tree.on('selectLeaf', function(e, branch, elem) {
            var videoUrl = elem.href,
                videoId,
                description = elem.getAttribute('data-description') || '',
                $elem = $(elem);

            videoId = Player.getVideoIdFromUrl(videoUrl);

            if (videoId) {
                player.playVideo(videoId);

                config.descriptionElem.innerHTML = description;
            }
        });

        $(elem).find('a').on('click', function(e) {
            var $el = $(this);
            var isExternal = $el.hasClass('is_external');

            if (isExternal)
                $el.attr('target', '_blank');
            else
                e.preventDefault();

        });
    }

    return VideoGallery;
});