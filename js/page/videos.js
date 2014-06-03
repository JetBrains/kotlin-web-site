define(['jquery', 'com/nav-tree', 'com/video-player'], function($, NavTree, Player) {

    return function(data) {

        NavTree.prototype.templates.leafItem = function(item) {
            var hasUrl = 'url' in item,
                hasDuration = 'duration' in item;

            var t =
                ['.tree-item.tree-leaf.js-item.js-leaf.video-item',
                    [
                    (hasUrl ? 'a' : 'div') + '.tree-item-title.tree-leaf-title.js-item-title.js-leaf-title.video-item-title', hasUrl ? {href: item.url} : null,
                        ['span.marker'],
                        ['span.text', item.title],
                    hasDuration
                        ? ['span.duration', item.duration]
                        : null
                    ]
                ];

            return t;
        };

        var tree,
            player;

        tree = new NavTree(data.elem, {data: data.videos});

        player = new Player('video-player', {
            width: '100%',
            height: 480,
            videoId: 'viiDaLpPfN4'
        });

        tree.on('selectLeaf', function(e, branch, elem) {
            var videoUrl = elem.href,
                videoId;

            videoId = Player.getVideoIdFromUrl(videoUrl);
            player.playVideo(videoId);
        });

        $(data.elem).find('a').on('click', function(e) {
            e.preventDefault();
        });
    };

});