var $ = require('jquery');
var emitter = require('../../../utils/emitter');
var EVENTS = require('./events');
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
 * @param {Array<Event>} events
 * @constructor
 */
function Map(node, events) {
  var instance = new google.maps.Map(node, mapOptions);
  this.instance = instance;
  this.markers = [];
  this.events = events;

  this._createMarkers(events);
  this._handleMarkers();

  emitter.on(EVENTS.EVENT_DESELECTED, this.reset.bind(this));

  instance.addListener('click', this.reset.bind(this));
}

/**
 * @static
 * @param {HTMLElement} node
 * @param {Array<Event>} events
 * @returns {Deferred}
 */
Map.create = function (node, events) {
  return $.getScript(MAP_API_URL).then(function () {
    return new Map(node, events);
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

  events.forEach(function (event, i) {
    markers.push(new Marker(event, map, i));
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


module.exports = Map;