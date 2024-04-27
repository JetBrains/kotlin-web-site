import $ from 'jquery';
import './index.scss';

class NavTree {
  constructor(elem) {
    this.elem = elem;
    this.id = elem.getAttribute('id');
    this.STORAGE_KEY = 'nav_items';
    this._events = {};
    this._initEvents();
    this.restoreItemsState();
  }

  on(eventName, callback) {
    this._events[eventName] = callback;
  }

  fireEvent(eventName, ...args) {
    if (eventName in this._events) {
      return this._events[eventName].apply(this, args);
    }
  }

  _initEvents() {
    $(this.elem).on('click', '.js-item-title', (e) => {
      const elem = e.currentTarget;
      const branchElem = elem.parentNode;
      const $branch = $(branchElem);
      const itemId = $branch.attr('data-id');
      const isActive = $(elem).hasClass('is_active');
      const isLeaf = $branch.hasClass('js-leaf');

      if (isLeaf) {
        this._selectLeaf(elem, e, branchElem);
        return;
      }

      if (isActive) {
        this._closeBranch(elem, e);
      } else {
        this._openBranch(elem, e);
      }

      if (itemId) {
        const states = this.getItemsStateInfo() || {};
        states[itemId] = !isActive;
        this.setItemsStateInfo(states);
      }
    });
  }

  _selectLeaf(leafElem, e, branchElem) {
    $(this.elem).find('.js-leaf-title').each((i, elem) => {
      const $elem = $(elem);
      const isActive = $elem.hasClass('is_active');

      if (elem === leafElem) {
        if (!isActive) {
          this.fireEvent('selectLeaf', e, branchElem, elem);
          $elem.addClass('is_active');
        }
      } else {
        $elem.removeClass('is_active');
      }
    });
  }

  getItemsStateInfo() {
    const storageKey = `${this.STORAGE_KEY}_${this.id}`;
    const savedState = JSON.parse(sessionStorage.getItem(storageKey));
    const activeItem = $('.js-leaf-title.is_active').closest('.js-branch').attr('data-id');
    const defaultState = activeItem ? { [activeItem]: true } : {};
    return savedState || defaultState;
  }

  setItemsStateInfo(info) {
    const storageKey = `${this.STORAGE_KEY}_${this.id}`;
    sessionStorage.setItem(storageKey, JSON.stringify(info));
  }

  restoreItemsState() {
    const states = this.getItemsStateInfo();

    $(this.elem).find('.js-item-title').each((_, elem) => {
      const $elem = $(elem);
      const $parent = $elem.parent();
      const itemId = $parent.attr('data-id');

      if (itemId in states) {
        states[itemId] ? this._openBranch(elem) : this._closeBranch(elem);
      } else {
        this._closeBranch(elem);
      }
    });
  }

  _openBranch(branchTitleElem, e) {
    const $elem = $(branchTitleElem);
    const $parent = $elem.parent();

    $elem.addClass('is_active');
    $parent.addClass('_opened').removeClass('_closed');

    this.fireEvent('openBranch', e, branchTitleElem.parentNode, branchTitleElem);
  }

  _closeBranch(branchTitleElem, e) {
    const $elem = $(branchTitleElem);
    const $parent = $elem.parent();

    $elem.removeClass('is_active');
    $parent.addClass('_closed').removeClass('_opened');

    this.fireEvent('closeBranch', e, branchTitleElem.parentNode, branchTitleElem);
  }
}

export default NavTree;
