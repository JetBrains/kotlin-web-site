import {createElement} from 'react';
import {hydrate} from 'react-dom';

import Header from './header/index.jsx';
import Footer from './footer/index.jsx';
import Teach from './teach/index.jsx';
import Courses from './courses/index.jsx';
import {openPopup} from '../com/search/search';

export const initComponents = () => {
  getKTLComponentsComments().forEach(({name, node, props}) => {
    switch (name) {
      case 'header':
        initKTLComponent(node.nextElementSibling, Header, {
          ...props,
          onSearchClick: openPopup,
        });
        break;
      case 'footer':
        initKTLComponent(node.nextElementSibling, Footer, props);
        break;
      case 'teach':
        initKTLComponent(node.nextElementSibling, Teach, props);
        break;
      case 'courses':
        initKTLComponent(node.nextElementSibling, Courses, props);
        break;
      default:
        console.error(`The "${name}" component was not found.`);
        break;
    }
  });
}

function getKTLComponentsComments() {
  const comment = ' ktl_component: ';

  const result = [];
  let currentNode = null;

  const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ALL);

  while (currentNode = iterator.nextNode()) {
    if (currentNode.nodeType === 8) {
      const {nodeValue} = currentNode;

      if (nodeValue.startsWith(comment)) {
        const {name, props} = JSON.parse(nodeValue.substring(comment.length));

        result.push({
          name: name,
          props: props,
          node: currentNode,
        });
      }
    }
  }

  return result;
}

function initKTLComponent(node, Component, props) {
  const fake_node = document.createElement('div');
  hydrate(createElement(Component, props), fake_node);
  node.replaceWith(fake_node);
}