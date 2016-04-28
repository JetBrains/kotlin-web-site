var $ = require('jquery');
var Event = require('./Event');
var City = require('./City');

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

module.exports = EventsStore;