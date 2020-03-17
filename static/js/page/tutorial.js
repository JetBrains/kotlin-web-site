import $ from 'jquery'
import NavTree from '../com/nav-tree/index'

$(document).ready(() => {
  new NavTree(document.querySelector('.js-side-tree-nav'));
});