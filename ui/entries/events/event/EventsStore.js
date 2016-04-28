var $ = require('jquery');
var Event = require('./Event');
var City = require('./City');

/**
 * @param {Object} eventsData Raw events data
 * @param {Object} citiesData Raw cities data
 * @constructor
 */
function EventsStore(eventsData, citiesData) {
  var store = this;
  this.events = [];
  this.cities = [];

  citiesData.forEach(function (data) {
    store.cities.push(new City(data));
  });

  eventsData.forEach(function (data) {
    var event = new Event(data);
    if (event.city)
      store.events.push(event);
  });

  store.events.forEach(function (event) {
    var eventCity = store.cities.filter(function (city) {
      return city.name == event.city;
    })[0];

    event.city = eventCity;
  });

  this.sort();
}

/**
 * @static
 * @param {string} eventsUrl
 * @param {string} citiesUrl
 * @returns {Deferred}
 */
EventsStore.create = function (eventsUrl, citiesUrl) {
  var events;
  var cities;

  return $.getJSON(eventsUrl)
    .then(function (result) { events = result })
    .then(function () { return $.getJSON(citiesUrl) })
    .then(function (result) { cities = result })
    .then(function () { return new EventsStore(events, cities) })
};

/**
 * @static
 */
EventsStore.filters = {
  time: function (time, event) {
    var isMatch = false;
    if (time == 'upcoming')
      isMatch = event.isUpcoming();
    else if (time == 'past')
      isMatch = !event.isUpcoming();
    else
      isMatch = true;

    return isMatch;
  },

  lang: function (lang, event) {
    return event.lang == lang;
  },

  materials: function (materialType, event) {
    return event.content && event.content.hasOwnProperty(materialType);
  },

  bounds: function (bounds, event) {
    return bounds.contains(event.getBounds());
  }
};

EventsStore.prototype.sort = function () {
  this.events.sort(function (a, b) {
    var dateA = a.date;
    var dateB = b.date;
    var isADateIsRange = Array.isArray(dateA);
    var isBDateIsRange = Array.isArray(dateB);
    var compareA = isADateIsRange ? dateA[1] : dateA;
    var compareB = isBDateIsRange ? dateB[1] : dateB;

    if (compareA === compareB) {
      return 0;
    }

    return (compareA < compareB) ? 1 : -1;
  });
};

/**
 * @param {Array<Event>} [events]
 * @returns {Array<Event>}
 */
EventsStore.prototype.getUpcoming = function (events) {
  var events = events || this.events;
  return events.filter(function (event) {
    return event.isUpcoming();
  });
};

/**
 * @param {Array<Event>} [events]
 * @returns {Array<Event>}
 */
EventsStore.prototype.getPast = function (events) {
  var events = events || this.events;
  return events.filter(function (event) {
    return !event.isUpcoming();
  });
};

/**
 * @param {Object} constraints
 * @param {string} constraints.time
 * @param {string} constraints.lang
 * @param {string} constraints.materials
 * @param {google.maps.LatLng} constraints.bounds
 * @param {Array<Event>} [events]
 * @returns {Array<Event>}
 */
EventsStore.prototype.filter = function (constraints, events) {
  var events = events || this.events;
  var filtered = [];
  var constraintNames = Object.keys(constraints);

  events.forEach(function (event) {
    var performedConstraintsCount = 0;

    constraintNames.forEach(function (name) {
      var constraint = constraints[name];
      var filter = EventsStore.filters[name];
      if (filter(constraint, event)) {
        performedConstraintsCount++;
      }
    });

    if (performedConstraintsCount == constraintNames.length)
      filtered.push(event);
  });

  return filtered;
};

module.exports = EventsStore;