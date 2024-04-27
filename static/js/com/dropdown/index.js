const $ = require('jquery');
const Emitter = require('event-emitter');

require('./styles.scss');

const CLASSES = {
  OPENED: '_opened',
  ITEM_SELECTED: '_selected'
};

const EVENTS = {
  SELECT: 'select'
};

class Dropdown {
  constructor(node, config) {
    this._emitter = Emitter({});
    this.config = config;
    this.$dropdown = this.render();
    this.selectedIndex = config.selectedIndex || 0;

    $(document.body).on('click', (event) => {
      const selectedValueNode = this.$dropdown.find('.js-selected-value').get(0);
      event.target === selectedValueNode ? this.toggle() : this.close();
    });

    this.$dropdown.on('click', '.js-item', (event) => {
      const index = $(event.currentTarget).index();
      this.select(index);
    });

    $(node).append(this.$dropdown);

    if (config.onSelect) {
      this.onSelect(config.onSelect);
    }

    this.select(this.selectedIndex, false);
  }

  onSelect(callback) {
    this._emitter.on(EVENTS.SELECT, callback);
  }

  render() {
    const { items } = this.config;
    const data = {
      items,
      selectedIndex: this.selectedIndex || 0
    };

    return $(renderTemplate(data));
  }

  open() {
    this.$dropdown.addClass(CLASSES.OPENED);
  }

  close() {
    this.$dropdown.removeClass(CLASSES.OPENED);
  }

  toggle() {
    this.isOpened() ? this.close() : this.open();
  }

  isOpened() {
    return this.$dropdown.hasClass(CLASSES.OPENED);
  }

  select(index, emit = true) {
    if (this.selectedIndex === index) {
      return;
    }
    this.selectedIndex = index;

    const $items = this.$dropdown.find('.js-item');
    const $selectedItem = $items.eq(index);
    const selectedValue = $selectedItem.attr('data-value');
    const selectedText = $selectedItem.text();

    $items.removeClass(CLASSES.ITEM_SELECTED);
    $selectedItem.addClass(CLASSES.ITEM_SELECTED);

    this.$dropdown.find('.js-selected-value').text(selectedText);

    if (emit) {
      this._emitter.emit(EVENTS.SELECT, selectedValue);
    }
  }
}

function renderTemplate(dropdown) {
  const items = Object.entries(dropdown.items)
    .map(([key, value]) => `<div class="dropdown-item js-item" data-value="${key}">${value}</div>`)
    .join('');

  return `
    <div class="dropdown js-dropdown">
      <div class="dropdown-selected-value js-selected-value">${dropdown.items[dropdown.selectedIndex]}</div>
      <div class="dropdown-items">${items}</div>
    </div>
  `;
}

module.exports = Dropdown;