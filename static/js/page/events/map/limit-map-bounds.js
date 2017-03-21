/**
 * Partially taken from https://github.com/ubilabs/google-map-bounds-limit
 */

let ignoreNextMapMove = false;
let lastValidCenter = null;

/**
 * Limits panning on the map beyond the given latitude.
 * @param  {google.maps.Map} map  The google maps instance
 * @param  {google.maps.LatLngBounds} maxBounds The maximum visible bounds
 */
function limitMapMove(map, maxBounds) {
  if (ignoreNextMapMove) {
    ignoreNextMapMove = false;
    return;
  }

  const bounds = map.getBounds();

  if (maxBounds.contains(bounds.getNorthEast()) && maxBounds.contains(bounds.getSouthWest())) {
    lastValidCenter = map.getCenter();
    return;
  }

  ignoreNextMapMove = true;

  if (lastValidCenter) {
    map.setCenter(lastValidCenter);
    return;
  }

  lastValidCenter = recalculateMapCenter(map, maxBounds);
  map.setCenter(lastValidCenter);
}

/**
 * Calculate a new map-center such that the visible area of the map is
 * completely within given max bounds.
 * @param  {google.maps.Map} map  The google maps instance
 * @param  {google.maps.LatLngBounds} maxBounds The maximum visible bounds
 * @return {google.maps.LatLng}  The recalculated map center
 */
function recalculateMapCenter(map, maxBounds) {
  const center = map.getCenter();
  const bounds = map.getBounds();
  const offsets = getBoundsOffsets(bounds, maxBounds);
  const newCenter = {
    lat: center.lat(),
    lng: center.lng()
  };

  if (offsets.north > 0) {
    newCenter.lat = center.lat() - offsets.n;
  }

  if (offsets.east > 0) {
    newCenter.lng = center.lng() - offsets.e;
  }

  if (offsets.south > 0) {
    newCenter.lat = center.lat() + offsets.s;
  }

  if (offsets.west > 0) {
    newCenter.lng = center.lng() + offsets.w;
  }

  return new google.maps.LatLng(newCenter.lat, newCenter.lng);
}

/**
 * Calculates the boundary-offsets in every direction for the given pair of
 * LatLngBounds. Returned values are > 0 if inner is smaller than outer in
 * that direction (when all values are >= 0, inner is a true subset of outer).
 * @param {google.maps.LatLngBounds} inner The first bounds
 * @param {google.maps.LatLngBounds} outer The second bounds
 * @return {Object} The numeric offset per direction.
 */
function getBoundsOffsets(inner, outer) {
  return {
    north: inner.getNorthEast().lat() - outer.getNorthEast().lat(),
    east: inner.getNorthEast().lng() - outer.getNorthEast().lng(),
    south: outer.getSouthWest().lat() - inner.getSouthWest().lat(),
    west: outer.getSouthWest().lng() - inner.getSouthWest().lng()
  };
}

/**
 * Limits latitude panning to a given limit.
 * @param  {google.maps.Map} map  The google map object
 * @param  {google.maps.LatLngBounds} maxBounds  The bounds limit
 */
export default function limit(map, maxBounds) {
  map.addListener('center_changed', () => limitMapMove(map, maxBounds));
}