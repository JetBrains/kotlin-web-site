var $ = require('jquery');
var Event = require('./Event');
var City = require('./City');
var languages = require('./lang');

/**
 * @param {Object} eventsData Raw events data
 * @param {Object} citiesData Raw cities data
 * @constructor
 */
function EventsStore(eventsData, citiesData) {
  var store = this;
  this.events = [];
  this.cities = [];

  var citiesNames = citiesData.map(function(data) {
    return data.name;
  });

  var citiesMissedInDict = [];

  eventsData
    .filter(function (data) { return typeof data.location !== 'undefined'; })
    .map(function (data) { return data.location; })
    .filter(function (value, index, self) { return self.indexOf(value) === index; })
    .forEach(function(eventCity) {
      if (citiesNames.indexOf(eventCity) === -1) {
        citiesMissedInDict.push(eventCity);
      }
    });

  if (citiesMissedInDict.length > 0) {
    console.warn('Cities missed in cities.yml:\n' + citiesMissedInDict.join('\n'));
  }

  citiesData.forEach(function (data) {
    store.cities.push(new City(data));
  });

  eventsData.forEach(function (data, i) {
    var eventCityExistInDict = data.location && citiesNames.indexOf(data.location) !== -1;

    if (!eventCityExistInDict) {
      return;
    }

    data.id = i.toString();
    store.events.push(new Event(data));
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

/**
 * @static
 */
EventsStore.materialsDict = {
  examples: 'Examples',
  slides: 'Slides',
  video: 'Video',
  pdf: 'PDF',
  article: 'Article'
};

EventsStore.prototype.sort = function () {
  this.events.sort(function (a, b) {
    var compareA = a.endDate;
    var compareB = b.endDate;

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
EventsStore.prototype.getUpcomingEvents = function (events) {
  var events = events || this.events;
  return events.filter(function (event) {
    return event.isUpcoming();
  }).sort(function(eventA, eventB) {
    var startA = eventA.startDate;
    var startB = eventB.startDate;

    if (startA === startB) {
      return 0;
    }

    return startA < startB ? -1 : 1;
  });
};

/**
 * @param {Array<Event>} [events]
 * @returns {Array<Event>}
 */
EventsStore.prototype.getPastEvents = function (events) {
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

/**
 * @returns {Object<string, string>}
 */
EventsStore.prototype.getLanguages = function () {
  var idsList = $.unique( this.events.map(function(event){ return event.lang }) );
  var map = {};

  idsList.forEach(function (langId) {
    if (langId in languages) {
      map[langId] = languages[langId].name;
    }
  });

  return map;
};

/**
 * @see EventsStore.materialsDict
 * @returns {Object<string, string>}
 */
EventsStore.prototype.getMaterials = function () {
  var list = [];

  this.events.forEach(function (event) {
    if (event.content) {
      list = list.concat(Object.keys(event.content));
    }
  });

  var listMap = {};
  list = $.unique(list);
  list.forEach(function (materialId) {
    listMap[materialId] = EventsStore.materialsDict[materialId];
  });

  return listMap;
};

module.exports = EventsStore;