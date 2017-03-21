import $ from "jquery";
import Emitter from "event-emitter";
import template from './view.twig';

require('./styles.scss');

const CLASSES = {
  ITEM_SELECTED: '_selected'
};

const EVENTS = {
  SELECT: 'select'
};

export default class Switcher {
  /**
   * @param {HTMLElement|string} node
   * @param {Object} config
   * @param {Object<string, string>} config.items Values.
   * @param {number} [config.selectedIndex=0]
   * @param {Function} [config.onSelect]
   */
  constructor(node, config) {
    const that = this;
    const $node = $(node);

    this.config = config;
    this.items = config.items;
    this.$node = $node;
    this.$switcher = this.render();
    this._emitter = Emitter({});

    const $items = this.$switcher.find('.js-item');

    $items.each(function (i, elem) {
      $(elem).on('click', that.select.bind(that, i));
    });

    config.onSelect && this.onSelect(config.onSelect);

    this.select(config.selectedIndex || 0, false);
  }

  onSelect(callback) {
    this._emitter.on(EVENTS.SELECT, callback);
  }

  render() {
    const rendered = template.render({switcher: this});
    const $rendered = $(rendered);
    this.$node.append($rendered);

    return $rendered;
  }

  select(index, emit) {
    if (this.selectedIndex == index) {
      return;
    }
    this.selectedIndex = index;

    const shouldEmit = typeof emit == 'boolean' ? emit : true;
    const $switcher = this.$switcher;
    const $items = $switcher.find('.js-item');
    const $selectedItem =  $( $items.get(index) );
    const selectedValue = $selectedItem.attr('data-value');

    $items.each((i, elem) => {
      const $item = $(elem);

      if (i === index) {
        $item.addClass(CLASSES.ITEM_SELECTED);
      }
      else {
        $item.removeClass(CLASSES.ITEM_SELECTED);
      }
    });

    shouldEmit && this._emitter.emit('select', selectedValue);
  }
}