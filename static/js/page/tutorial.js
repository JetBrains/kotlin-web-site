import $ from 'jquery';
import NavTree from '../com/nav-tree/index';

// Function to initialize NavTree when the document is ready
function initializeNavTree() {
  const sideTreeNav = document.querySelector('.js-side-tree-nav');
  new NavTree(sideTreeNav);
}

// Using jQuery's document.ready function to initialize NavTree
$(initializeNavTree);
