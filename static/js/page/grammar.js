import $ from 'jquery';
import Toc from '../com/toc';
import NavTree from '../com/nav-tree';

// Function to initialize the document
function initializeDocument() {
  const sideTreeNav = document.querySelector('.js-side-tree-nav');
  const tocTarget = document.getElementById('js-toc');

  if (!sideTreeNav) {
    console.error('Element with class "js-side-tree-nav" not found.');
    return;
  }

  if (!tocTarget) {
    console.error('Element with id "js-toc" not found.');
    return;
  }

  const navTree = new NavTree(sideTreeNav);
  const toc = new Toc();

  toc.render({ target: tocTarget });
}

// Initialize document when DOM is ready
$(initializeDocument);
