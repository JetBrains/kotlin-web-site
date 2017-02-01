require('./styles.scss');
var $ = require('jquery');
var template = require('./view.twig');
var emitter = require('../../../util/emitter');
var EVENTS = require('../events-list');
var checkElementIsInViewport = require('in-viewport');

/**
 * @param {HTMLElement|string} node
 * @param {EventsStore} store
 * @constructor
 */
function EventsList(node, store) {
  var that = this;
  this.store = store;
  this.currentFilters = {};
  this.$node = $(node);
  this.mode = 'list';

  emitter.on(EVENTS.EVENTS_FILTERED, function (filters) {
    var filteredEvents = store.filter(filters);
    that.currentFilters = filters;
    that.applyFilteredResults(filteredEvents);
  });

  emitter.on(EVENTS.EVENT_SELECTED, function (selectedEvent) {
    that.showEventDetails(selectedEvent);
    that.mode = 'detailed';
  });

  emitter.on(EVENTS.EVENT_DESELECTED, function () {
    that.hideEventDetails();
    that.mode = 'list';
  });

  emitter.on(EVENTS.EVENT_HIGHLIGHTED, function (event) {
    event.highlight();
  });

  emitter.on(EVENTS.EVENT_UNHIGHLIGHTED, function (event) {
    event.unhighlight();
  });

  // Filter events when map zoomed
  emitter.on(EVENTS.MAP_BOUNDS_CHANGED, function (bounds) {
    return;
    var request = $.extend({}, that.currentFilters, {bounds: bounds});
    that.currentFilters = request;
    var filteredEvents = store.filter(request);
    that.applyFilteredResults(filteredEvents);
  });

  this.render();
}

EventsList.prototype.render = function () {
  var $content = $(template.render());
  this.$content = $content;

  var upcomingEvents = this.store.getUpcomingEvents();
  var pastEvents = this.store.getPastEvents();

  var $upcoming = $content.find('.js-upcoming-events');
  var $past = $content.find('.js-past-events');
  this.$upcomingGroup = $content.find('.js-upcoming-events-group');
  this.$pastGroup = $content.find('.js-past-events-group');

  upcomingEvents.forEach(function (event) {
    event.render($upcoming.get(0));
  });

  pastEvents.forEach(function (event) {
    event.render($past.get(0));
  });

  this.store.events.forEach(function (event) {
    var $node = $(event.node);
    $node.on('click', function () {
      emitter.emit(EVENTS.EVENT_DESELECTED);
      emitter.emit(EVENTS.EVENT_SELECTED, event);
    });

    $node.on('mouseenter', function (e) {
      e.stopPropagation();
      emitter.emit(EVENTS.EVENT_HIGHLIGHTED, event);
    });

    $node.on('mouseleave', function (e) {
      e.stopPropagation();
      emitter.emit(EVENTS.EVENT_UNHIGHLIGHTED, event);
    });
  });

  this.$node.append($content);
};

/**
 * @param {Array<Event>} filteredEvents
 */
EventsList.prototype.applyFilteredResults = function (filteredEvents) {
  var store = this.store;
  var upcomingEventsInResults = store.getUpcomingEvents(filteredEvents);
  var pastEventsInResults = store.getPastEvents(filteredEvents);

  store.events.forEach(function (event) {
    (filteredEvents.indexOf(event) > -1)
      ? event.show()
      : event.hide();
  });

  upcomingEventsInResults.length > 0
    ? this.$upcomingGroup.show()
    : this.$upcomingGroup.hide();

  pastEventsInResults.length > 0
    ? this.$pastGroup.show()
    : this.$pastGroup.hide();
};

/**
 * @param {Event} event
 */
EventsList.prototype.showEventDetails = function (event) {
  var $node = $(event.node);
  var inViewport = checkElementIsInViewport(event.node);
  this.currentEvent = event;

  $node.addClass('_detailed').removeClass('_normal');

  if (!inViewport) {
    $('html,body').animate({ scrollTop: $node.offset().top });
  }
};

EventsList.prototype.hideEventDetails = function () {
  if (!this.currentEvent) {
    return;
  }

  var event = this.currentEvent;
  $(event.node).addClass('_normal').removeClass('_detailed');

  this.currentEvent = null;
};

module.exports = EventsList;