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
}

City.prototype.toString = function () {
  return this.name;
};

module.exports = City;