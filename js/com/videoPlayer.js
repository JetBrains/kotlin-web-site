define(['jquery'], function ($)
{
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

        that._config = $.extend({}, that._defaults, config);

        if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
            require(['https://www.youtube.com/iframe_api'], function () {
                if ('onYouTubeIframeAPIReady' in window) {
                    var prev = window.onYouTubeIframeAPIReady;
                    window.onYouTubeIframeAPIReady = function() {
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

    Player.QUALITY = {
        DEFAULT: 'default',
        SMALL: 'small',      // max 640х360
        MEDIUM: 'medium',    // min 640x360
        LARGE: 'large',      // min 854x80
        HD720: 'hd720'       // min 1280x720
    };

    Player.VIDEO_ID_REGEXP = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;

    Player.VIDEO_EMBED_URL = '//www.youtube.com/embed/{video_id}?autoplay=1';

    Player.prototype._defaults = {
        width: 450,
        height: 390,
        videoId: null,
        autoPlay: false,
        autoHide: true,
        controls: true,
        showInfo: true,
        quality: Player.QUALITY.DEFAULT,
        showRelativeVideos: false
    };

    Player.prototype._elem = null;

    Player.prototype._config = null;

    Player.prototype._player = null;

    Player.prototype._events = {};

    Player.prototype.isReady = false;

    /**
     * @static
     * @param videoUrl
     * @returns {string}
     */
    Player.getVideoIdFromUrl = function(videoUrl) {
        var videoId = null;
        var match = videoUrl.match(Player.VIDEO_ID_REGEXP);

        if (match !== null && typeof match[7] !== 'undefined') {
            videoId = match[7];
        }

        return videoId;
    };

    Player.prototype._createPlayer = function () {
        var that = this,
            elem = that._elem,
            config = that._config,
            player;

        player = new YT.Player(elem, {
            width: config.width,
            height: config.height,
            videoId: config.videoId,
            playerVars: {
                vq: config.quality,
                rel: config.showRelativeVideos === true ? 1 : 0,
                autoplay: config.autoPlay === true ? 1 : 0,
                controls: config.controls === true ? 1 : 0,
                showinfo: config.showInfo === true ? 1 : 0,
                autohide: config.autoHide === true ? 1 : 0
            }
        });

        player.addEventListener('onReady', function() {
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

    Player.prototype.fireEvent = function(eventName) {
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
     * @param {string} quality Available values:
     *                         - default
     *                         - small (max 640х360)
     *                         - medium (min 640x360)
     *                         - large (min 854x80)
     *                         - hd720 (min 1280x720)
     */
    Player.prototype.setQuality = function (quality) {
        this._player.setPlaybackQuality(quality);
    };

    return Player;
});