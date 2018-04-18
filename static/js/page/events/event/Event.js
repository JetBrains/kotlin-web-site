import template from './view.twig';
import $ from "jquery";
import {formatDate} from '../../../util/date';

require('./styles.scss');

const DEFAULT_LANG = 'en';

export default class Event {
  /**
   * @param {Object} data
   */
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.url = data.url;
    this.subject = data.subject;
    this.speaker = data.speaker;
    this.description = data.description;
    this.tags = data.tags ? data.tags.split(',').map(t => t.trim()) : [];

    if (!data.location) {
      console.warn(data.title + ' has no location');
    }

    this.city = data.location;
    this.lang = data.lang || DEFAULT_LANG;
    this.content = data.content;
    this.image = data.image;
    this.pinned = !!(data.pinned && data.pinned === 'true');

    this.startDate = new Date(data.startDate + "T00:00:00");
    this.endDate = new Date(data.endDate + "T00:00:00");
    this.formattedDate = formatDate(this.startDate, this.endDate);
  }

  isUpcoming() {
    return this.endDate >= new Date();
  }

  getBounds() {
    return this.city.getBounds();
  }

  hasTag(tag) {
    return this.tags.indexOf(tag) > -1;
  }

  render(mountNode) {
    const rendered = template.render({event: this, mode: 'normal'});

    if (mountNode) {
      const tempElement = document.createElement('div');
      tempElement.innerHTML = rendered;
      const node = tempElement.childNodes[0];
      this.node = node;
      mountNode.appendChild(node);
    }

    return rendered;
  }

  renderDetailed() {
    return template.render({event: this, mode: 'detailed'});
  }

  highlight() {
    $(this.node).addClass('_highlighted');
  }

  unhighlight() {
    $(this.node).removeClass('_highlighted');
  }

  show() {
    $(this.node).show();
  }

  hide() {
    $(this.node).hide();
  }
}