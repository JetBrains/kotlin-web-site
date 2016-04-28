var $ = require('jquery');
var emitter = require('../../../utils/emitter');
var EVENTS = require('./../events');
var Marker = require('./Marker');

var MAP_API_URL = 'https://maps.googleapis.com/maps/api/js';

var mapOptions = {
  center: {
    lat: 20,
    lng: 0
  },
  zoom: 2,
  disableDefaultUI: true,
  zoomControl: true,
  styles: require('./styles')
};

/**
 * @param {HTMLElement} node
 * @param {EventsStore} store
 * @constructor
 */
function Map(node, store) {
  var that = this;
  this.store = store;
  this.markers = [];

  var instance = new google.maps.Map(node, mapOptions);
  this.instance = instance;

  this._createMarkers(store.events);
  this._handleMarkers();

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
  emitter.on(EVENTS.EVENT_DESELECTED, this.reset.bind(this));

  // Filter markers when filtering event fired
  emitter.on(EVENTS.EVENTS_FILTERED, function (filteredEvents) {
    that.applyFilteredResults(filteredEvents);
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

  events.forEach(function (event) {
    markers.push(new Marker(event, map));
  });

  this.markers = markers;
};

Map.prototype._handleMarkers = function () {
  var markers = this.markers;

  emitter.on(EVENTS.EVENT_SELECTED, function (event) {
    var currentMarker = event.marker;
    markers.forEach(function (marker) {
      if (marker === currentMarker) {
        currentMarker.activate();
      } else {
        marker.deactivate();
      }
    });
  });
};

Map.prototype.reset = function () {
  this.markers.forEach(function (marker) {
    marker.closeWindow();
    marker.activate();
  });
};

Map.prototype.applyFilteredResults = function (filteredEvents) {
  this.store.events.forEach(function (event) {
    filteredEvents.indexOf(event) > -1
      ? event.marker.show()
      : event.marker.hide();
  })
};


module.exports = Map;