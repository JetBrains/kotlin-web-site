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

  var upcoming = this.store.getUpcoming();
  var past = this.store.getPast();
  var $upcoming = $content.find('.js-upcoming-events');
  var $past = $content.find('.js-past-events');

  if (upcoming.length > 0) {
    $upcoming.append(upcoming.map(function (event) {
      return event.render();
    }));
  } else {
    $content.find('.js-upcoming-events-group').hide();
  }

  $past.append(past.map(function (event) {
    return event.render();
  }));

  $('.js-events-list-col').html($content);
};

// TODO
EventsList.prototype.applyFilteredResults = function (results) {
  //this.currentFilters;
};

// TODO
EventsList.prototype.showEventDetails = function (event) {

};

// TODO
EventsList.prototype.hideEventDetails = function () {

};

module.exports = EventsList;