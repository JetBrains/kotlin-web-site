var $ = require('jquery');
var emitter = require('../../../util/emitter');
var EVENTS = require('./../events-list');
var Marker = require('./Marker');
var limitMap = require('./limit-map-bounds');

var MAP_API_URL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAMF-gJllft62W5l9xfgE6DBhaa6YmIJs0';

var mapOptions = {
  center: {
    lat: 20,
    lng: 0
  },
  zoom: 2,
  disableDefaultUI: true,
  zoomControl: true,
  maxZoom: 12,
  minZoom: 2,
  styles: require('./styles')
};

/**
 * @param {HTMLElement} node
 * @param {EventsStore} store
 * @constructor
 */
function Map(node, store) {
  var $mapNode = $(node);
  var that = this;
  this.node = $mapNode.get(0);
  this.store = store;
  this.markers = [];

  var instance = new google.maps.Map($mapNode.get(0), mapOptions);
  this.instance = instance;

  // Restore state after user clicks anywhere except of event marker
  instance.addListener('click', function () {
    that.reset.bind(this);
    emitter.emit(EVENTS.EVENT_DESELECTED);
  });

  // Emit bounds change event
  var isFirstBoundsChangedEvent = true;
  instance.addListener('bounds_changed', function () {
    if (isFirstBoundsChangedEvent) {
      isFirstBoundsChangedEvent = false;
      return;
    }

    setTimeout(function () {
      emitter.emit(EVENTS.MAP_BOUNDS_CHANGED, instance.getBounds());
    }, 200);
  });

  // Restore state when marker deselected
  emitter.on(EVENTS.EVENT_DESELECTED, function () {
    that.reset();
  });

  // Filter markers when filtering event fired
  emitter.on(EVENTS.EVENTS_FILTERED, function (filters) {
    var filteredEvents = store.filter(filters);
    that.applyFilteredResults(filteredEvents);
  });

  emitter.on(EVENTS.EVENT_HIGHLIGHTED, function (event) {
    event.marker.highlight();
  });

  emitter.on(EVENTS.EVENT_UNHIGHLIGHTED, function (event) {
    event.marker.unhighlight();
  });

  // MARKERS
  this._createMarkers(store.events);
  var markers = this.markers;

  emitter.on(EVENTS.EVENT_SELECTED, function (event) {
    var currentMarker = event.marker;

    markers.forEach(function (marker) {
      if (marker === currentMarker) {
        marker.activate();
        marker.openWindow();
      } else {
        marker.deactivate();
        marker.closeWindow();
      }
    });

    instance.panTo(event.getBounds());
  });
}

/**
 * @static
 * @param {HTMLElement} node
 * @param {EventsStore} store
 * @returns {Deferred}
 */
Map.create = function (node, store) {
  return $.getScript(MAP_API_URL).then(function () {
    return new Map(node, store);
  });
};

/**
 * @type {Array<Marker>}
 */
Map.prototype.markers = null;

/**
 * @param {Array<Event>} events
 */
Map.prototype._createMarkers = function (events) {
  var map = this;
  var markers = [];

  var cities = [];
  var eventsByCities = {};

  events.forEach(function (event) {
    let city = event.city;

    if (!event.city) {
        return;
    }
    
    if(cities.indexOf(city) >= 0) {
      eventsByCities[city].push(event);
    } else {
      cities.push(city);
      eventsByCities[city] = [event];
    }
  });

  let step = 500;  // The grid step in meters

  cities.forEach(function (city) {
    var x = 0;
    var y = 0;

    eventsByCities[city].forEach(function (event) {
      markers.push(new Marker(event, map, _calculateOffset(city.position, x * step, y * step)));

      if(x == 0) {
        x = y + 1;
        y = 0;
      } else {
        x--;
        y++;
      }
    });
  });

  this.markers = markers;
};

/**
 * @param {Object} position
 * @param {number} x Latitude offset in meters
 * @param {number} y Longitude offset in meters
 * */
var _calculateOffset = function(position, x, y) {
  // Hack from http://gis.stackexchange.com/a/2964
  let _x = x / 111111;
  let _y = y / Math.cos(position.lat * Math.PI / 180) / 111111;
  return {lat: _x, lng: _y};
};

Map.prototype._limitWorldBounds = function() {
  var map = this.instance;

  var maxBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-85, -175),
    new google.maps.LatLng(85, 175)
  );

  limitMap(map, maxBounds);
};

Map.prototype.reset = function () {
  this.markers.forEach(function (marker) {
    marker.activate();
    marker.closeWindow();
  });
};

Map.prototype.applyFilteredResults = function (filteredEvents) {
  var map = this.instance;

  this.store.events.forEach(function (event) {
    filteredEvents.indexOf(event) > -1
      ? event.marker.show()
      : event.marker.hide();
  });

  var eventsBounds = new google.maps.LatLngBounds(null);

  filteredEvents.forEach(function (event) {
    eventsBounds.extend(event.getBounds());
  });

  if (filteredEvents.length == 0) {
    return;
  }

  map.fitBounds(eventsBounds);

  var zoom = map.getZoom();
  if (zoom <= 2) {
    map.setCenter({lat: 39.90971744298563, lng: -49.34941524999998});
  }
};


module.exports = Map;