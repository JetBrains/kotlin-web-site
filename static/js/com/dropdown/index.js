var $ = require('jquery');
var Emitter = require('event-emitter');

require('./styles.scss');
var template = require('./view.twig');

var CLASSES = {
  OPENED: '_opened',
  ITEM_SELECTED: '_selected'
};

var EVENTS = {
  SELECT: 'select'
};

/**
 * @param {HTMLElement|string} node
 * @param {Object} config
 * @param {number} [config.selectedIndex=0]
 * @param {string} [config.selected]
 * @param {Function} [config.onSelect]
 * @constructor
 */
function Dropdown(node, config) {
  if (!(this instanceof Dropdown))
    return new Dropdown(node, config);

  this._emitter = Emitter({});
  var that = this;
  this.config = config;
  var $dropdown = this.render();
  this.$dropdown = $dropdown;
  var $items = $dropdown.find('.js-item');
  var selectedValueNode = $dropdown.find('.js-selected-value').get(0);

  $(document.body).on('click', function(event) {
    event.target === selectedValueNode
      ? that.toggle()
      : that.close();
  });

  $items.each(function (i, elem) {
    const $elem = $(elem);
    if($elem.attr('data-value') == config.selected){
      config.selectedIndex = i;
    }
    $elem.on('click', that.select.bind(that, i));
  });

  $(node).append($dropdown);

  config.onSelect && this.onSelect(config.onSelect);

  this.select(config.selectedIndex || 0, false);
}

Dropdown.prototype.onSelect = function (callback) {
  this._emitter.on(EVENTS.SELECT, callback);
};

Dropdown.prototype.render = function () {
  var config = this.config;
  var data = $.extend({}, {
    items: config.items,
    selectedIndex: config.selectedIndex || 0
  });

  var rendered = template.render({dropdown: data});
  return $(rendered);
};

Dropdown.prototype.open = function () {
  this.$dropdown.addClass(CLASSES.OPENED);
};

Dropdown.prototype.close = function () {
  this.$dropdown.removeClass(CLASSES.OPENED);
};

Dropdown.prototype.toggle = function() {
  this.isOpened() ? this.close() : this.open();
};

Dropdown.prototype.isOpened = function () {
  return this.$dropdown.hasClass(CLASSES.OPENED);
};

Dropdown.prototype.select = function (index, emit) {
  if (this.selectedIndex == index) {
    return;
  }
  this.selectedIndex = index;

  var emit = typeof emit == 'boolean' ? emit : true;
  var $dropdown = this.$dropdown;
  var $items = $dropdown.find('.js-item');
  var $selectedItem =  $( $items.get(index) );
  var selectedValue = $selectedItem.attr('data-value');
  var selectedText = $selectedItem.text();

  $items.each(function (i, elem) {
    var $item = $(elem);

    if (i === index)
      $item.addClass(CLASSES.ITEM_SELECTED);
    else
      $item.removeClass(CLASSES.ITEM_SELECTED);
  });

  $dropdown.find('.js-selected-value').text(selectedText);

  emit && this._emitter.emit('select', selectedValue);
};

module.exports = Dropdown;