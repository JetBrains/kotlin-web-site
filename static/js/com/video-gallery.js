import $ from 'jquery';
import NavTree from '../com/nav-tree';
import Player from '../com/video-player';

NavTree.prototype.templates.leafItem = function (item) {
  let hasUrl = 'url' in item,
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

  const t =
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

class VideoGallery {
  constructor(elem, config) {
    this.tree = new NavTree(elem, {data: config.data});
    this.player = new Player(config.playerElem, {
      width: '100%',
      height: 480,
      videoId: 'viiDaLpPfN4'
    });

    this.tree.on('selectLeaf', (e, branch, elem) => {
      const videoUrl = elem.href,
        videoId = Player.getVideoIdFromUrl(videoUrl),
        description = elem.getAttribute('data-description') || '';

      if (videoId) {
        this.player.playVideo(videoId);
        config.descriptionElem.innerHTML = description;
      }
    });

    $(elem).find('a').on('click', (e) => {
      const $elem = $(e.currentTarget);
      const isExternal = $elem.hasClass('is_external');

      if (isExternal)
        $elem.attr('target', '_blank');
      else
        e.preventDefault();

    });
  }
}

export default VideoGallery;