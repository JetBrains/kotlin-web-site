import $ from "jquery";
import Emitter from "event-emitter";
import Switcher from "../switcher";
import Dropdown from "../../../com/dropdown/index";
import template from './view.twig';
import timeSelectValues from './time-select-items';

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
   * @param {Object} config.initialFilters
   * @param {EventsStore} config.store
   */
  constructor(node, config) {
    this.$node = $(node);
    this.$panel = this.render();
    this._emitter = Emitter({});

    const $timeSelector = this.$panel.find('.js-time-selector');
    const $languageSelectorNode = this.$panel.find('.js-language-selector');
    const $materialSelectorNode = this.$panel.find('.js-material-selector');

    // Initial filters
    // TODO: values from hash
    const {initialFilters} = config;
    const timeSelectSelectedIndex = Object.keys(timeSelectValues).indexOf(initialFilters.time);

    const handleSelect = (type, value) => {
      const eventData = {};
      eventData[type] = value;
      $.extend(initialFilters, eventData);
      this._emitter.emit(EVENTS.SELECT, initialFilters);
    };

    this.timeSelector = new Switcher($timeSelector, {
      items: timeSelectValues,
      selectedIndex: timeSelectSelectedIndex,
      onSelect: (time) => {
        handleSelect('time', time);
        history.replaceState(null, null, `?time=${time}`);
      }
    });

    // setTimeout(() => this.timeSelector.select(1), 300);

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