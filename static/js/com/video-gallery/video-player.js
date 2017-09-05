import $ from 'jquery';

/**
 * @param {HTMLElement|string} elem HTML node or node ID
 * @param {object} config
 * @returns {Player}
 * @constructor
 */
function Player(elem, config) {
  var that = this,
    playerElem;

  playerElem = document.createElement('div');
  elem = (typeof elem === 'string') ? document.getElementById(elem) : elem;
  elem.appendChild(playerElem);

  that._elem = playerElem;

  that._config = Player.getConfig(config);

  if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
    $.getScript('https://www.youtube.com/iframe_api', function () {
      if ('onYouTubeIframeAPIReady' in window) {
        var prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function () {
          prev();
          that._createPlayer();
        }
      }
      else {
        window.onYouTubeIframeAPIReady = function () {
          that._createPlayer();
        };
      }
    });
  } else {
    that._createPlayer();
  }

  return that;
}

Player.EVENT = {
  READY: 'ready',
  PLAYING: 'play',
  ENDED: 'end',
  PAUSED: 'pause',
  BUFFERING: 'buffering',
  CUED: 'cued'
};

Player.THEME = {
  DARK: 'dark',
  LIGHT: 'light'
};

Player.QUALITY = {
  DEFAULT: 'default',
  SMALL: 'small',      // max 640х360
  MEDIUM: 'medium',    // min 640x360
  LARGE: 'large',      // min 854x80
  HD720: 'hd720'       // min 1280x720
};

Player.VIDEO_ID_REGEXP = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;

Player.VIDEO_EMBED_URL = '//www.youtube.com/embed/{video_id}';

Player._defaults = {
  width: 450,
  height: 390,
  videoId: null,
  autoPlay: false,
  autoHide: false,
  showControls: true,
  showInfo: true,
  showRelativeVideos: false,
  quality: Player.QUALITY.DEFAULT,
  startTime: 0,
  disableBranding: true,
  inlinePlayback: false,
  theme: Player.THEME.DARK
};

/**
 * @static
 * @param videoUrl
 * @returns {string}
 */
Player.getVideoIdFromUrl = function (videoUrl) {
  var videoId = null;
  var match = videoUrl.match(Player.VIDEO_ID_REGEXP);

  if (match !== null && typeof match[7] !== 'undefined') {
    videoId = match[7];
  }

  return videoId;
};

/**
 *  Creates Player config using defaults and merges them with another config (if specified).
 *
 * @param {object} config [optional]
 * @returns {object}
 */
Player.getConfig = function (config) {
  var config = config || {};
  return $.extend({}, Player._defaults, config);
};

/**
 * Create YouTube player config using Player config format.
 *
 * @param config
 * @returns {object} Config object for native YouTube player
 */
Player.createConfigForYTPlayer = function (config) {
  var config = config || Player.getConfig(config),
    ytPlayerConfig;

  ytPlayerConfig = {
    width: config.width,
    height: config.height,
    videoId: config.videoId,
    playerVars: {
      vq: config.quality,
      rel: config.showRelativeVideos ? 1 : 0,
      autoplay: config.autoPlay ? 1 : 0,
      controls: config.showControls ? 1 : 0,
      showinfo: config.showInfo ? 1 : 0,
      autohide: config.autoHide ? 1 : 0,
      start: config.startTime,
      modestbranding: config.disableBranding ? 1 : 0,
      playsinline: config.inlinePlayback ? 1 : 0,
      theme: config.theme
    }
  };

  return ytPlayerConfig;
};

Player.prototype._elem = null;

Player.prototype._config = null;

Player.prototype._player = null;

Player.prototype._events = {};

Player.prototype.isReady = false;

Player.prototype._createPlayer = function () {
  var that = this,
    elem = that._elem,
    player;

  player = new YT.Player(elem, Player.createConfigForYTPlayer(that._config));

  player.addEventListener('onReady', function () {
    that.isReady = true;
    that.fireEvent(Player.EVENT.READY);
  });

  player.addEventListener('onStateChange', function (currentState) {
    var events = that._events,
      eventName = Player.EVENT;

    switch (currentState.data) {
      case YT.PlayerState.ENDED:
        that.fireEvent(eventName.ENDED);
        break;

      case YT.PlayerState.PLAYING:
        that.fireEvent(eventName.PLAYING);
        break;

      case YT.PlayerState.PAUSED:
        that.fireEvent(eventName.PAUSED);
        break;

      case YT.PlayerState.BUFFERING:
        that.fireEvent(eventName.BUFFERING);
        break;

      case YT.PlayerState.CUED:
        that.fireEvent(eventName.CUED);
        break;
    }
  });

  that._player = player;
};

Player.prototype.fireEvent = function (eventName) {
  if (eventName in this._events) {
    return this._events[eventName].call(this);
  }
};

Player.prototype.on = function (eventName, callback) {
  this._events[eventName] = callback;
};

Player.prototype.play = function () {
  this._player.playVideo();
};

Player.prototype.pause = function () {
  this._player.pauseVideo();
};

Player.prototype.stop = function () {
  this._player.stopVideo();
};

/**
 * @param {string} quality Video quality
 * @see Player.QUALITY
 */
Player.prototype.setQuality = function (quality) {
  this._player.setPlaybackQuality(quality);
};

/**
 * Loads video and starts playback.
 *
 * @param {string} videoId
 */
Player.prototype.loadVideo = function (videoId) {
  this._player.cueVideoById(videoId);
};

/**
 * Loads video thumbnail and prepare player for playback.
 *
 * @param {string} videoId
 */
Player.prototype.playVideo = function (videoId) {
  var isIOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;

  if (isIOS) {
    this.loadVideo(videoId);
  } else {
    this._player.loadVideoById(videoId);
  }

};

export default Player;