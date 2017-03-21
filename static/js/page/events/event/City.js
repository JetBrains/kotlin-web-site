export default class City {
  /**
   * @param {Object} data
   * @param {string} data.name
   * @param {Object} data.position
   * @param {Number} data.position.lat
   * @param {Number} data.position.lng
   */
  constructor(data) {
    this.name = data.name;
    this.position = data.geo;
    this.bounds = null;
  }

  toString() {
    return this.name;
  }

  getBounds() {
    const position = this.position;

    if (!this.bounds)
      this.bounds = new google.maps.LatLng(position.lat, position.lng);

    return this.bounds;
  };
}