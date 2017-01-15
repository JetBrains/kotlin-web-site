/**
 *
 * @param {Object} data
 * @param {string} data.name
 * @param {Object} data.position
 * @param {Number} data.position.lat
 * @param {Number} data.position.lng
 * @constructor
 */
function City(data) {
  this.name = data.name;
  this.position = data.geo;
  this.bounds = null;
}

City.prototype.toString = function () {
  return this.name;
};

City.prototype.getBounds = function () {
  var position = this.position;

  if (!this.bounds)
    this.bounds = new google.maps.LatLng(position.lat, position.lng);

  return this.bounds;
};

module.exports = City;