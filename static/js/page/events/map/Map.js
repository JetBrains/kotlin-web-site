import $ from "jquery";
import emitter from "../../../util/emitter";
import EVENTS from "./../events-list";
import Marker from "./Marker";
import limitMap from "./limit-map-bounds";

const MAP_API_URL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAMF-gJllft62W5l9xfgE6DBhaa6YmIJs0';

const mapOptions = {
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

export default class Map {
  /**
   * @param {HTMLElement} node
   * @param {EventsStore} store
   * @param {Object} initialFilters
   */
  constructor(node, store, initialFilters = null) {
    const $mapNode = $(node);
    const that = this;
    this.node = $mapNode.get(0);
    this.store = store;
    this.markers = [];
    this.initialFilters = initialFilters;

    const instance = new google.maps.Map($mapNode.get(0), mapOptions);
    this.instance = instance;

    // Restore state after user clicks anywhere except of event marker
    instance.addListener('click', () => {
      this.reset();
      emitter.emit(EVENTS.EVENT_DESELECTED);
    });

    // Emit bounds change event
    let isFirstBoundsChangedEvent = true;
    instance.addListener('bounds_changed', () => {
      if (isFirstBoundsChangedEvent) {
        isFirstBoundsChangedEvent = false;
        return;
      }

      setTimeout(() => {
        emitter.emit(EVENTS.MAP_BOUNDS_CHANGED, instance.getBounds());
      }, 200);
    });

    // Restore state when marker deselected
    emitter.on(EVENTS.EVENT_DESELECTED, () => {
      this.reset();
    });

    // Filter markers when filtering event fired
    emitter.on(EVENTS.EVENTS_FILTERED, (filters) => {
      const filteredEvents = store.filter(filters);
      this.applyFilteredResults(filteredEvents);
    });

    emitter.on(EVENTS.EVENT_HIGHLIGHTED, (event) => {
      event.marker.highlight();
    });

    emitter.on(EVENTS.EVENT_UNHIGHLIGHTED, (event) => {
      event.marker.unhighlight();
    });

    // MARKERS
    const markers = this.markers = store.events
        .filter(event => event.city)
        .map(event => new Marker(event, this));

    emitter.on(EVENTS.EVENT_SELECTED, (event) => {
      const currentMarker = event.marker;

      markers.forEach((marker) => {
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

    if (this.initialFilters) {
      const filtered = this.store.filter(this.initialFilters);
      this.applyFilteredResults(filtered);
    }
  }

  /**
   * @static
   * @param {HTMLElement} node
   * @param {EventsStore} store
   * @param {Object} initialFilters
   * @returns {Deferred}
   */
  static create(node, store, initialFilters = null) {
    return $.getScript(MAP_API_URL).then(() => new Map(node, store, initialFilters));
  }

  /**
   * @param {Array<Event>} events
   */
  _createMarkers(events) {


  }

  _limitWorldBounds() {
    const map = this.instance;

    const maxBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-85, -175),
        new google.maps.LatLng(85, 175)
    );

    limitMap(map, maxBounds);
  }

  reset() {
    this.markers.forEach((marker) => {
      marker.activate();
      marker.closeWindow();
    });
  }

  applyFilteredResults(filteredEvents) {
    const map = this.instance;

    this.store.events.forEach((event) => {
      filteredEvents.indexOf(event) > -1
          ? event.marker.show()
          : event.marker.hide();
    });

    const eventsBounds = new google.maps.LatLngBounds(null);

    filteredEvents.forEach(event => eventsBounds.extend(event.getBounds()));

    if (filteredEvents.length == 0) {
      return;
    }

    map.fitBounds(eventsBounds);

    const zoom = map.getZoom();
    if (zoom <= 2) {
      map.setCenter({lat: 39.90971744298563, lng: -49.34941524999998});
    }
  }
}
