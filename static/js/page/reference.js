import NavTree from '../com/nav-tree/index';

// Function to initialize NavTree when the document is ready
function initializeNavTree() {
  const sideTreeNav = document.querySelector('.js-side-tree-nav');
  if (sideTreeNav) {
    new NavTree(sideTreeNav);
  } else {
    console.error('Element with class "js-side-tree-nav" not found.');
  }
}

// Check if the DOM is ready before initializing NavTree
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNavTree);
} else {
  initializeNavTree();
}
