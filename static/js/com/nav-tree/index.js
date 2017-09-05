import $ from 'jquery';
import './index.scss'

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
  };

  fireEvent(eventName) {
    if (eventName in this._events) {
      const args = Array.prototype.slice.call(arguments, 1);
      return this._events[eventName].apply(this, args);
    }
  };

  _initEvents() {
    $(this.elem.querySelectorAll('.js-item-title')).on('click', (e) => {
      const elem = e.currentTarget,
        branchElem = e.currentTarget.parentNode,
        $branch = $(branchElem),
        itemId = $branch.attr('data-id'),
        isActive = $(elem).hasClass('is_active'),
        isLeaf = $branch.hasClass('js-leaf');

      if (isLeaf) {
        this._selectLeaf(elem, e);
        return;
      }

      if (isActive) {
        this._closeBranch(elem, e);
      }
      else {
        this._openBranch(elem, e);
      }

      if (itemId) {
        let states = this.getItemsStateInfo();
        states = states === null ? {} : states;
        states[itemId] = !isActive;
        this.setItemsStateInfo(states);
      }
    });
  };

  _selectLeaf(leafElem, e, branchElem) {
    $(this.elem).find('.js-leaf-title').each((i, elem) => {
      let $elem = $(elem),
        isActive = $elem.hasClass('is_active');

      if (elem === leafElem) {
        if (!isActive) {
          this.fireEvent('selectLeaf', e, branchElem, elem);
          $elem.addClass('is_active');
        }
      } else {
        $elem.removeClass('is_active');
      }
    });
    return true;
  };

  getItemsStateInfo() {
    const storageKey = this.STORAGE_KEY + '_' + this.id;
    const savedState = JSON.parse(sessionStorage.getItem(storageKey));
    if (savedState) {
      return savedState
    }
    const activeItem = $('.js-leaf-title.is_active').closest('.js-branch').attr('data-id');
    const defaultState = {};
    if (activeItem) {
      defaultState[activeItem] = true;
    }
    return defaultState;
  };

  setItemsStateInfo(info) {
    const storageKey = this.STORAGE_KEY + '_' + this.id;
    sessionStorage.setItem(storageKey, JSON.stringify(info));
  };

  restoreItemsState() {
    const states = this.getItemsStateInfo();
    if (!states) {
      return;
    }

    $(this.elem.querySelectorAll('.js-item-title')).each((_, elem) => {
      const $elem = $(elem),
        $parent = $elem.parent(),
        itemId = $parent.attr('data-id');

      if (itemId in states) {
        if (states[itemId] === true)
          this._openBranch(elem);
        else
          this._closeBranch(elem);
      } else {
        this._closeBranch(elem)
      }
    })
  };

  _openBranch(branchTitleElem, e) {
    const $elem = $(branchTitleElem),
      $parent = $elem.parent();

    $elem.addClass('is_active');
    $parent.addClass('_opened');
    $parent.removeClass('_closed');

    this.fireEvent('openBranch', e, branchTitleElem.parentNode, branchTitleElem);
  };

  _closeBranch(branchTitleElem, e) {
    const $elem = $(branchTitleElem),
      $parent = $elem.parent();

    $elem.removeClass('is_active');
    $parent.addClass('_closed');
    $parent.removeClass('_opened');

    this.fireEvent('closeBranch', e, branchTitleElem.parentNode, branchTitleElem);
  };

}

export default NavTree;