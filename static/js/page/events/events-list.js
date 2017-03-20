const events = {
  /**
   * @param {Object} Filters request
   */
  EVENTS_FILTERED: 'events_filtered',

  /**
   * @param {Event}
   */
  EVENT_HIGHLIGHTED: 'event_highlighted',

  /**
   * @param {Event}
   */
  EVENT_UNHIGHLIGHTED: 'event_unhighlighted',

  /**
   * @param {Event}
   */
  EVENT_SELECTED: 'event_selected',

  /**
   * No params
   */
  EVENT_DESELECTED: 'event_deselected',

  /**
   * @param {google.maps.LatLng} New map bounds
   */
  MAP_BOUNDS_CHANGED: 'map_bounds_changed'
};

export default events;