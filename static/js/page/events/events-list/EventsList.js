import $ from "jquery";
import checkElementIsInViewport from "in-viewport";
import emitter from "../../../util/emitter";
import EVENTS from "../events-list";
import template from './view.twig';

require('./styles.scss');

export default class EventsList {
  /**
   * @param {HTMLElement|string} node
   * @param {EventsStore} store
   * @param {Object} initialFilters
   */
  constructor(node, store) {
    this.store = store;
    this.currentFilters = {};
    this.$node = $(node);
    this.mode = 'list';

    emitter.on(EVENTS.EVENTS_FILTERED, (filters) => {
      const filteredEvents = store.filter(filters);
      this.currentFilters = filters;
      this.applyFilteredResults(filteredEvents);
    });

    emitter.on(EVENTS.EVENT_SELECTED, (selectedEvent) => {
      this.showEventDetails(selectedEvent);
      this.mode = 'detailed';
    });

    emitter.on(EVENTS.EVENT_DESELECTED, () => {
      this.hideEventDetails();
      this.mode = 'list';
    });

    emitter.on(EVENTS.EVENT_HIGHLIGHTED, (event) => {
      event.highlight();
    });

    emitter.on(EVENTS.EVENT_UNHIGHLIGHTED, (event) => {
      event.unhighlight();
    });

    // Filter events when map zoomed
    emitter.on(EVENTS.MAP_BOUNDS_CHANGED, (bounds) => {
      return;
      const request = $.extend({}, this.currentFilters, {bounds: bounds});
      this.currentFilters = request;
      const filteredEvents = store.filter(request);
      this.applyFilteredResults(filteredEvents);
    });

    this.render();
  }

  render() {
    const $content = $(template.render());
    this.$content = $content;

    const upcomingEvents = this.store.getUpcomingEvents();
    const pastEvents = this.store.getPastEvents();

    const $upcoming = $content.find('.js-upcoming-events');
    const $past = $content.find('.js-past-events');
    this.$upcomingGroup = $content.find('.js-upcoming-events-group');
    this.$pastGroup = $content.find('.js-past-events-group');

    upcomingEvents.forEach(event => event.render($upcoming.get(0)));
    pastEvents.forEach(event => event.render($past.get(0)));

    this.store.events.forEach((event) => {
      const $node = $(event.node);

      $node.on('click', () => {
        emitter.emit(EVENTS.EVENT_DESELECTED);
        emitter.emit(EVENTS.EVENT_SELECTED, event);
      });

      $node.on('mouseenter', (e) => {
        e.stopPropagation();
        emitter.emit(EVENTS.EVENT_HIGHLIGHTED, event);
      });

      $node.on('mouseleave', (e) => {
        e.stopPropagation();
        emitter.emit(EVENTS.EVENT_UNHIGHLIGHTED, event);
      });
    });

    this.$node.append($content);
  }

  /**
   * @param {Array<Event>} filteredEvents
   */
  applyFilteredResults(filteredEvents) {
    const store = this.store;
    const upcomingEventsInResults = store.getUpcomingEvents(filteredEvents);
    const pastEventsInResults = store.getPastEvents(filteredEvents);

    store.events.forEach((event) => {
      (filteredEvents.indexOf(event) > -1) ? event.show() : event.hide();
    });

    upcomingEventsInResults.length > 0
      ? this.$upcomingGroup.show()
      : this.$upcomingGroup.hide();

    pastEventsInResults.length > 0
      ? this.$pastGroup.show()
      : this.$pastGroup.hide();
  }

  /**
   * @param {Event} event
   */
  showEventDetails(event) {
    const $node = $(event.node);
    const inViewport = checkElementIsInViewport(event.node);
    this.currentEvent = event;

    $node.addClass('_detailed').removeClass('_normal');

    if (!inViewport) {
      $('html,body').animate({ scrollTop: $node.offset().top });
    }
  }

  hideEventDetails() {
    if (!this.currentEvent) {
      return;
    }

    const event = this.currentEvent;
    $(event.node).addClass('_normal').removeClass('_detailed');

    this.currentEvent = null;
  }
}