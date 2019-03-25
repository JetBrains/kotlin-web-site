import $ from 'jquery'
import NavTree from '../com/nav-tree/index'
import './kotlin-gradle-code-blocks'

$(document).ready(() => {
  new NavTree(document.querySelector('.js-side-tree-nav'));
});