import $ from "jquery";
import Switcher from "../switcher";
import Dropdown from "../../../com/dropdown/index";
import pageEmitter from "../../../util/emitter";
import PAGE_EVENTS from "../events-list";
import Emitter from "event-emitter";
import template from './view.twig';

require('./styles.scss');

const EVENTS = {
  SELECT: 'select'
};

export default class FilterPanel {
  /**
   * @param {HTMLElement|string} node
   * @param {Object} config
   * @param {Object} config.languages
   * @param {Object} config.materials
   * @param {Object} config.filters
   * @param {EventsStore} config.store
   */
  constructor(node, config) {
    const that = this;
    this.$node = $(node);
    this.$panel = this.render();
    this._emitter = Emitter({});

    const $timeSelector = this.$panel.find('.js-time-selector');
    const $languageSelectorNode = this.$panel.find('.js-language-selector');
    const $materialSelectorNode = this.$panel.find('.js-material-selector');

    // Initial filters
    // TODO: values from hash
    const currentFilters = {
      time: 'all',
      lang: 'all',
      materials: 'all'
    };

    function handleSelect(type, value) {
      const eventData = {};
      eventData[type] = value;
      $.extend(currentFilters, eventData);

      Object.keys(currentFilters).forEach((name) => {
        if (currentFilters[name] === 'all') {
          delete currentFilters[name];
        }
      });

      that._emitter.emit(EVENTS.SELECT, currentFilters);
    }

    this.timeSelector = new Switcher($timeSelector, {
      items: {all: 'All', upcoming: 'Upcoming', past: 'Past'},
      // selectedIndex: 1,
      onSelect: (time) => handleSelect('time', time)
    });

    this.languageSelector = new Dropdown($languageSelectorNode, {
      items: $.extend({all: 'All'}, config.languages),
      onSelect: (lang) => handleSelect('lang', lang)
    });

    this.materialsSelector = new Dropdown($materialSelectorNode, {
      items: $.extend({all: 'All'}, config.materials),
      onSelect: (materials) => handleSelect('materials', materials)
    });
  }

  onSelect(callback) {
    this._emitter.on(EVENTS.SELECT, callback);
  }

  render() {
    const rendered = template.render();
    const $rendered = $(rendered);
    this.$node.append($rendered);
    return $rendered;
  }
}