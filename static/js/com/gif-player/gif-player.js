import $ from 'jquery';
import './gif-player.scss'

/**
 * List of tags strings.
 * @const
 * @enum {String}
 */
const TAGS = {
  img: 'img',
  picture: 'picture',
  source: 'source'
};

/**
 * List of attributes strings.
 * @const
 * @enum {String}
 */
const ATTRIBUTES = {
  src: 'src',
  srcSet: 'srcset',
  gifSrc: 'data-gif-src',
  gifPlaceholder: 'data-gif-placeholder',
  media: 'media'
};

/**
 * List of class-names values.
 * @const
 * @enum {String}
 */
const CLASSES = {
  player: 'gif-player',
  playerShowMod: '_show-gif',
  playerActiveMod: '_active',
  image: 'gif-player__image',
  imageActiveMod: '_active',
  imageLoadingMod: '_loading'
};

// Empty array for storing instances
GifPlayer.instances = [];

/**
 * Class representing GifPlayer.
 * @param {String|HTMLElement} element Selector or node of the image tag
 *
 * @constructor
 * @property {jQuery} $player
 * @property {jQuery} $image
 * @property {Function} clickHandler
 */
function GifPlayer(element) {
  if (!(this instanceof GifPlayer))
    return new GifPlayer(element);

  // Search for the element
  const $element = $(element, 'body');

  if ($element === 0) throw new Error('Mount node for component not found.');
  else if ($element.length > 1) throw new Error('Component can be attached only to 1 node. ' + $element.length + ' nodes given.');

  //Store element node
  this.$element = $element;
  this.elementIsImage = this.$element.is(TAGS.img);

  // Get gif source
  const gifSrc = $element.attr(ATTRIBUTES.gifSrc);

  if (this.elementIsImage && !gifSrc) throw new Error('Can\'t init Gif-player, please provide ' + ATTRIBUTES.gifSrc + ' attribute for ' + element + '.');
  // Store image node
  this.$image = this.elementIsImage ? $element : $(element).find(TAGS.img);

  // Init and store player wrapper
  this.$player = this._initPlayerWrapper();


  //init breakpoints behavior
  if (!this.elementIsImage) this._initBreakpointsBehavior();

  // Init and store click handler to be able to remove it on destroy
  this.clickHandler = this._initClickHandler();

  // Listen for clicks and call toggle play function
  this.$player.on('click', this.clickHandler);

  // Store this instance
  GifPlayer._addInstance(this);
}

/**
 * Add instance of GifPlayer to instances array.
 * @param {GifPlayer} instance
 * @static
 * @private
 */
GifPlayer._addInstance = function (instance) {
  GifPlayer.instances.push(instance);
};

/**
 * Remove instance of GifPlayer from instances array.
 * @param {GifPlayer} instance
 * @static
 */
GifPlayer._removeInstance = function (instance) {
  const index = GifPlayer.instances.indexOf(instance);

  if (index > -1) {
    GifPlayer.instances.splice(index, 1);
  }
};

/**
 * Destroy all instances of GifPlayer.
 * @static
 */
GifPlayer.destroyAll = function () {
  GifPlayer.instances.forEach(function (instance) {
    instance.destroy();
  });

  GifPlayer.instances = [];
};

/**
 * Wrap an original image with a player node.
 * @private
 * @return {jQuery}
 */
GifPlayer.prototype._initPlayerWrapper = function () {
  const $image = this.$image;
  const $player = $('<div/>');

  // Adding class-names
  $player
    .addClass(CLASSES.player)
    .addClass(CLASSES.playerShowMod);

  // Wrap image with player node
  $image.wrap($player);

  return $image.parent();
};

/**
 * Init breapoints behavior for media queries
 */

GifPlayer.prototype._initBreakpointsBehavior = function () {
  this.defaultSrc = this.$image.attr(ATTRIBUTES.src);
  this.defaultGifSrc = this.$image.attr(ATTRIBUTES.gifSrc);

  if (this.$element.is(TAGS.picture)) {
    //find all media queries for this player instance
    this.mediaQueries = [];

    this.$element.find(TAGS.source).each((idx, source) => {
      this.mediaQueries.push($(source).attr('media'));
    });

    //add listeners for media queries
    this.mediaQueries.forEach((query) => {
      let currentQuery = window.matchMedia(query);

      this.setImagesForBreakpoint(currentQuery);

      currentQuery.addListener(function (e) {
        this.setImagesForBreakpoint(e);
      }.bind(this));
    });
  }
};

/**
 * Init click handler with saved links for the player and for the image node.
 * @private
 * @return {Function}
 */
GifPlayer.prototype._initClickHandler = function () {
  const gifPlayer = this;
  const $image = this.$image;

  return function () {
    let isActive = $image.hasClass(CLASSES.imageActiveMod);

    if (!isActive) {
      gifPlayer.play();
    }
    else {
      gifPlayer.stop();
    }
  }
};

/**
 * Start playing the gif.
 */
GifPlayer.prototype.play = function () {
  const $player = this.$player;
  const $image = this.$image;

  const gifSrc = $image.attr(ATTRIBUTES.gifSrc);
  const placeholder = $image.attr(ATTRIBUTES.src);

  // Set active player class
  $player.addClass(CLASSES.playerActiveMod);

  // Set image active and loading modifiers
  $image
    .addClass(CLASSES.imageActiveMod)
    .addClass(CLASSES.imageLoadingMod);

  // Store placeholder source in data-attribute
  $image.attr(ATTRIBUTES.gifPlaceholder, placeholder);

  // Load gif into image
  $image.attr(ATTRIBUTES.src, gifSrc);

  // Remove loading modifier if gif is loaded
  $image.load(function () {
    $image.removeClass(CLASSES.imageLoadingMod);
  })
};

/**
 * Stop playing the gif.
 */
GifPlayer.prototype.stop = function () {
  const $player = this.$player;
  const $image = this.$image;
  const placeholder = $image.attr(ATTRIBUTES.gifPlaceholder);

  // Remove player active modifier
  $player.removeClass(CLASSES.playerActiveMod);

  // Remove image active modifier
  $image.removeClass(CLASSES.imageActiveMod);

  // Replace gif source with the placeholder
  $image.attr(ATTRIBUTES.src, placeholder);
};

/**
 * Destroy function that removes click event handler from player node.
 */
GifPlayer.prototype.destroy = function () {
  this.stop();
  this.$player.off('click', this.clickHandler);

  GifPlayer._removeInstance(this);
};

/**
 * Set images for GifPlayer depending on media query
 */

GifPlayer.prototype.setImagesForBreakpoint = function () {
  const sourceToMatch = this._findSourceMatch();

  const srcToSet = sourceToMatch.length > 0 ? sourceToMatch.attr(ATTRIBUTES.srcSet) : this.defaultSrc;
  const gifSrcToSet = sourceToMatch.length > 0 ? sourceToMatch.attr(ATTRIBUTES.gifSrc) : this.defaultGifSrc;

  const attrToSetSrc = this.$image.hasClass(CLASSES.imageActiveMod) ? ATTRIBUTES.gifPlaceholder : ATTRIBUTES.src;

  this.$image.attr(ATTRIBUTES.gifSrc, gifSrcToSet);
  this.$image.attr(attrToSetSrc, srcToSet);
};

/**
 * Find source tag for matching media query if exists
 * @private
 * @return {Array}
 */

GifPlayer.prototype._findSourceMatch = function () {
  const currentQuery = this.mediaQueries.map(function (query) {
    return window.matchMedia(query);
  }).filter(function (query) {
    return query.matches === true;
  });

  return currentQuery.length > 0 ? this.$element.find(TAGS.source).filter(function () {
    return  $(this).attr(ATTRIBUTES.media) === currentQuery[0].media
  }) : [];
};

export default GifPlayer;

