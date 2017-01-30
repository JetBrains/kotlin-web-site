var $ = require('jquery');
var Switcher = require('../switcher/index');
var Dropdown = require('../dropdown/index');
var pageEmitter = require('../../../util/emitter');
var PAGE_EVENTS = require('../events-list');
var Emitter = require('event-emitter');

require('./styles.scss');
var template = require('./view.twig');

var EVENTS = {
  SELECT: 'select'
};

/**
 * @param {HTMLElement|string} node
 * @param {Object} config
 * @param {Object} config.languages
 * @param {Object} config.materials
 * @param {Object} config.filters
 * @param {EventsStore} config.store
 * @constructor
 */
function FilterPanel(node, config) {
  var that = this;
  this.$node = $(node);
  this.$panel = this.render();
  this._emitter = Emitter({});

  var $timeSelector = this.$panel.find('.js-time-selector');
  var $languageSelectorNode = this.$panel.find('.js-language-selector');
  var $materialSelectorNode = this.$panel.find('.js-material-selector');

  // Initial filters
  // TODO: values from hash
  var currentFilters = {
    time: 'all',
    lang: 'all',
    materials: 'all'
  };

  function handleSelect(type, value) {
    var eventData = {};
    eventData[type] = value;
    $.extend(currentFilters, eventData);

    Object.keys(currentFilters).forEach(function (name) {
      if (currentFilters[name] === 'all')
        delete currentFilters[name];
    });

    //pageEmitter.emit(PAGE_EVENTS.EVENTS_FILTERED, currentFilters);
    that._emitter.emit(EVENTS.SELECT, currentFilters);
  }

  this.timeSelector = new Switcher($timeSelector, {
    items: {all: 'All', upcoming: 'Upcoming', past: 'Past'},
    // selectedIndex: 1,
    onSelect: function (time) {
      handleSelect('time', time);
    }
  });

  this.languageSelector = new Dropdown($languageSelectorNode, {
    items: $.extend({all: 'All'}, config.languages),
    onSelect: function (lang) {
      handleSelect('lang', lang);
    }
  });

  this.materialsSelector = new Dropdown($materialSelectorNode, {
    items: $.extend({all: 'All'}, config.materials),
    onSelect: function (materials) {
      handleSelect('materials', materials);
    }
  });
}

FilterPanel.prototype.onSelect = function (callback) {
  this._emitter.on(EVENTS.SELECT, callback);
};

FilterPanel.prototype.render = function () {
  var rendered = template.render();
  var $rendered = $(rendered);
  this.$node.append($rendered);
  return $rendered;
};

module.exports = FilterPanel;