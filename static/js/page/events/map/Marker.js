var icon = require('./marker-icon.png');
var inactiveIcon = require('./marker-icon-inactive.png');
var highlightedIcon = require('./marker-icon-highlighted.png');
var EVENTS = require('./../events-list');
var emitter = require('../../../util/emitter');

/**
 * @param {Event} event
 * @param {Object} map Google Map instance
 * @param {Object} offset Latitude and Longitude to add to `event.city.position`
 * @constructor
 */
function Marker(event, map, offset) {
  var marker = this;
  this.event = event;
  event.marker = this;
  this.map = map;
  this.offset = offset;
  this.isActive = true;
  this.isHighlighted = false;

  // Marker instance
  var markerInstance = new google.maps.Marker({
    title: event.title,
    position: this.calculatePosition(),
    draggable: false,
    visible: true,
    icon: this.getIcon(),
    map: map ? map.instance : null
  });

  this.marker = markerInstance;

  markerInstance.addListener('click', function () {
    emitter.emit(EVENTS.EVENT_SELECTED, event);
  });

  markerInstance.addListener('mouseover', function () {
    marker.highlight();
    emitter.emit(EVENTS.EVENT_HIGHLIGHTED, event);
  });

  markerInstance.addListener('mouseout', function () {
    //marker.isActive ? marker.activate() : marker.deactivate();
    marker.unhighlight();
    emitter.emit(EVENTS.EVENT_UNHIGHLIGHTED, event);
  });

  // Info window
  var infoWindow = new google.maps.InfoWindow({
    content: event.title
  });

  infoWindow.addListener('closeclick', function () {
    emitter.emit(EVENTS.EVENT_DESELECTED);
  });

  this.infoWindow = infoWindow;
}

Marker.prototype.calculatePosition = function () {
    let cityPosition = this.event.city.position;
    return {lat: cityPosition.lat + this.offset.lat, lng: cityPosition.lng + this.offset.lng};
};

Marker.prototype.getIcon = function () {
  var mapZoom = this.map.instance.getZoom();
  var isActive = this.isActive;
  var isHighlighted = this.isHighlighted;
  var iconUrl = isActive ? icon : inactiveIcon;

  if (isHighlighted) {
    iconUrl = highlightedIcon;
  }

  return {
    scaledSize: {
      width: 15,
      height: 15
    },
    opacity: 1,
    url: iconUrl
  };
};

Marker.prototype.openWindow = function () {
  this.infoWindow.open(this.map.instance, this.marker);
};

Marker.prototype.closeWindow = function () {
  this.infoWindow.close();
};

Marker.prototype.highlight = function () {
  this.isHighlighted = true;
  this.marker.setIcon(this.getIcon());
  this.marker.setZIndex(30);
};

Marker.prototype.unhighlight = function () {
  this.isHighlighted = false;
  this.marker.setIcon(this.getIcon());
  this.marker.setZIndex(this.isActive ? 2 : 1);
};

Marker.prototype.activate = function () {
  this.isActive = true;
  this.isHighlighted = false;
  this.marker.setIcon(this.getIcon());
  this.marker.setZIndex(2);
};

Marker.prototype.deactivate = function () {
  this.isActive = false;
  this.isHighlighted = false;
  this.marker.setIcon(this.getIcon());
  this.marker.setZIndex(1);
};

Marker.prototype.show = function () {
  this.marker.setVisible(true);
};

Marker.prototype.hide = function () {
  this.marker.setVisible(false);
};

module.exports = Marker;