import $ from 'jquery';
import Toc from '../com/toc';
import NavTree from "../com/nav-tree";

$(function () {
  new NavTree(document.querySelector('.js-side-tree-nav'));

  const toc = new Toc();

  toc.render({
    target: document.getElementById('js-toc')
  });
});