import $ from 'jquery';
import './gif-player.scss';

const TAGS = {
  img: 'img',
  picture: 'picture',
  source: 'source'
};

const ATTRIBUTES = {
  src: 'src',
  srcSet: 'srcset',
  gifSrc: 'data-gif-src',
  gifPlaceholder: 'data-gif-placeholder',
  media: 'media'
};

const CLASSES = {
  player: 'gif-player',
  playerShowMod: '_show-gif',
  playerActiveMod: '_active',
  image: 'gif-player__image',
  imageActiveMod: '_active',
  imageLoadingMod: '_loading'
};

class GifPlayer {
  constructor(element) {
    if (!(this instanceof GifPlayer))
      return new GifPlayer(element);

    this.$element = $(element);
    this.elementIsImage = this.$element.is(TAGS.img);
    if (!this.elementIsImage && !this.$element.is(TAGS.picture)) {
      throw new Error('Invalid element type. Only img or picture elements supported.');
    }

    this.$image = this.elementIsImage ? this.$element : this.$element.find(TAGS.img);

    const gifSrc = this.$element.attr(ATTRIBUTES.gifSrc);
    if (this.elementIsImage && !gifSrc) {
      throw new Error(`Gif source attribute (${ATTRIBUTES.gifSrc}) missing.`);
    }

    this.$player = this._initPlayerWrapper();

    this.clickHandler = this._initClickHandler();
    this.$player.on('click', this.clickHandler);

    GifPlayer._addInstance(this);
  }

  static _addInstance(instance) {
    GifPlayer.instances.push(instance);
  }

  static _removeInstance(instance) {
    const index = GifPlayer.instances.indexOf(instance);
    if (index > -1) {
      GifPlayer.instances.splice(index, 1);
    }
  }

  static destroyAll() {
    GifPlayer.instances.forEach(instance => instance.destroy());
    GifPlayer.instances = [];
  }

  _initPlayerWrapper() {
    const $player = $('<div/>').addClass(CLASSES.player).addClass(CLASSES.playerShowMod);
    this.$image.wrap($player);
    return this.$image.parent();
  }

  _initClickHandler() {
    return () => this.$image.hasClass(CLASSES.imageActiveMod) ? this.stop() : this.play();
  }

  play() {
    const $player = this.$player;
    const $image = this.$image;
    const gifSrc = $image.attr(ATTRIBUTES.gifSrc);
    const placeholder = $image.attr(ATTRIBUTES.src);
    $player.addClass(CLASSES.playerActiveMod);
    $image.addClass(CLASSES.imageActiveMod).addClass(CLASSES.imageLoadingMod);
    $image.attr(ATTRIBUTES.gifPlaceholder, placeholder).attr(ATTRIBUTES.src, gifSrc).load(() => $image.removeClass(CLASSES.imageLoadingMod));
  }

  stop() {
    const $player = this.$player;
    const $image = this.$image;
    const placeholder = $image.attr(ATTRIBUTES.gifPlaceholder);
    $player.removeClass(CLASSES.playerActiveMod);
    $image.removeClass(CLASSES.imageActiveMod).attr(ATTRIBUTES.src, placeholder);
  }

  destroy() {
    this.stop();
    this.$player.off('click', this.clickHandler);
    GifPlayer._removeInstance(this);
  }
}

GifPlayer.instances = [];

export default GifPlayer;
