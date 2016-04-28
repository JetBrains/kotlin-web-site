require('./styles.scss');

var $ = require('jquery');
var template = require('./view.twig');
var emitter = require('../../../utils/emitter');
var EVENTS = require('../events');

/**
 * @param {EventsStore} store
 * @constructor
 */
function EventsList(store) {
  var that = this;
  this.store = store;
  this.currentFilters = {};

  emitter.on(EVENTS.EVENTS_FILTERED, function (events, filters) {
    that.currentFilters = filters;
    that.applyFilteredResults(events);
  });

  emitter.on(EVENTS.EVENT_SELECTED, function (event) {
    that.showEventDetails(event);
  });

  emitter.on(EVENTS.EVENT_DESELECTED, function () {
    that.hideEventDetails();
  });

  emitter.on(EVENTS.MAP_BOUNDS_CHANGED, function (bounds) {
    var request = $.extend({}, that.currentFilters, {bounds: bounds});
    var filteredEvents = store.filter(request);
    that.applyFilteredResults(filteredEvents);
    that.currentFilters = request;
  });
}

EventsList.prototype.render = function () {
  var $content = $(template.render());
  this.$content = $content;

  var upcoming = this.store.getUpcoming();
  var past = this.store.getPast();
  var $upcoming = $content.find('.js-upcoming-events');
  var $past = $content.find('.js-past-events');
  this.$upcoming = $upcoming;
  this.$past = $past;
  this.$upcomingGroup = $content.find('.js-upcoming-events-group');
  this.$pastGroup = $content.find('.js-past-events-group');

  upcoming.forEach(function (event) {
    event.render($upcoming.get(0));
  });

  past.forEach(function (event) {
    event.render($past.get(0));
  });

  $('.js-events-list-col').html($content);
};

EventsList.prototype.applyFilteredResults = function (filteredEvents) {
  var store = this.store;
  var upcomingEventsInResults = store.getUpcoming(filteredEvents);
  var pastEventsInResults = store.getPast(filteredEvents);

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

// TODO
EventsList.prototype.showEventDetails = function (event) {
  this.$content.find('.js-event-details')
    .html(event.renderDetailed())
    .show();
  this.$content.find('.js-list').hide();
};

// TODO
EventsList.prototype.hideEventDetails = function () {
  this.$content.find('.js-list').show();
  this.$content.find('.js-event-details').hide();
};

module.exports = EventsList;