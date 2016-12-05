var $ = require('jquery');
var Emitter = require('event-emitter');

require('./styles.scss');
var template = require('./view.twig');

var CLASSES = {
  ITEM_SELECTED: '_selected'
};

var EVENTS = {
  SELECT: 'select'
};

/**
 * @param {HTMLElement|string} node
 * @param {Object} config
 * @param {Object<string, string>} config.items Values.
 * @param {number} [config.selectedIndex=0]
 * @param {Function} [config.onSelect]
 * @constructor
 */
function Switcher(node, config) {
  var that = this;
  var $node = $(node);

  this.config = config;
  this.items = config.items;
  this.$node = $node;
  this.$switcher = this.render();
  this._emitter = Emitter({});

  var $items = this.$switcher.find('.js-item');

  $items.each(function (i, elem) {
    $(elem).on('click', that.select.bind(that, i));
  });

  config.onSelect && this.onSelect(config.onSelect);

  this.select(config.selectedIndex || 0, false);
}

Switcher.prototype.onSelect = function (callback) {
  this._emitter.on(EVENTS.SELECT, callback);
};

Switcher.prototype.render = function () {
  var rendered = template.render({switcher: this});
  var $rendered = $(rendered);
  this.$node.append($rendered);

  return $rendered;
};

Switcher.prototype.select = function (index, emit) {
  if (this.selectedIndex == index) {
    return;
  }
  this.selectedIndex = index;

  var emit = typeof emit == 'boolean' ? emit : true;
  var $switcher = this.$switcher;
  var $items = $switcher.find('.js-item');
  var $selectedItem =  $( $items.get(index) );
  var selectedValue = $selectedItem.attr('data-value');

  $items.each(function (i, elem) {
    var $item = $(elem);

    if (i === index)
      $item.addClass(CLASSES.ITEM_SELECTED);
    else
      $item.removeClass(CLASSES.ITEM_SELECTED);
  });

  emit && this._emitter.emit('select', selectedValue);
};

module.exports = Switcher;