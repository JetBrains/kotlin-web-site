import $ from 'jquery';
import NavTree from '../nav-tree/index';
import Player from './video-player';
import './video-gallery.scss';

class VideoGallery {
  constructor(elem, config) {
    this.tree = new NavTree(elem);
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