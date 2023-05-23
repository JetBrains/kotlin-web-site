import { hydrate } from "react-dom";
import { createElement } from "react";

export function ktlHelpers() {
  const comment = " ktl_component: ";

  const result = [];
  let currentNode = null;

  const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ALL);

  while (currentNode = iterator.nextNode()) {
    if (currentNode.nodeType === 8) {
      const { nodeValue } = currentNode;

      if (nodeValue.startsWith(comment)) {
        const { name, props } = JSON.parse(nodeValue.substring(comment.length));
        result.push({ name, props, node: currentNode });
      }
    }
  }

  return result;
}

export function initComponent(node, Component, props) {
  const fake_node = document.createElement('div');
  hydrate(createElement(Component, props), fake_node);
  node.replaceWith(fake_node);
}

export function replaceByComponent(node, Component, props) {
  const parentNode = node.parentNode;
  const fakeNode = document.createElement('div');

  hydrate(createElement(Component, props), fakeNode);

  let renderedNode = fakeNode.lastChild;

  if (fakeNode.children.length === 1) {
    node.replaceWith(renderedNode);
    return;
  }

  do {
    parentNode.insertBefore(node, renderedNode);
  } while (renderedNode = renderedNode.previousSibling)

  parentNode.removeChild(node);
}
