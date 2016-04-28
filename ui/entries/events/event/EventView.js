var template = require('./view.twig');

/**
 * @param {HTMLElement} node
 * @param {Event} event
 * @constructor
 */
function EventView(node, event) {
  this.node = node;
  this.event = event;
}

EventView.prototype.render = function () {
  return template.render(this);
};

module.exports = EventView;