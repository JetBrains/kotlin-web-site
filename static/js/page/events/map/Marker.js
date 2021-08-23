import EVENTS from "./../events-list";
import emitter from "../../../util/emitter";
import icon from './marker.png';
import inactiveIcon from './marker-inactive.png';
import highlightedIcon from './marker-highlighted.png';
import taggedIcon from './marker-tagged.png';
import taggedHighlightedIcon from './marker-tagged-highlighted.png';

export default class Marker {
  /**
   * @param {Event} event
   * @param {Object} map Google Map instance
   */
  constructor(event, map) {
    const marker = event.marker = this;
    this.event = event;
    this.map = map;
    this.isActive = true;
    this.isHighlighted = false;

    const markerInstance = new google.maps.Marker({
      title: event.alt || event.title,
      position: event.city.position,
      draggable: false,
      visible: true,
      icon: this.getIcon(),
      map: map ? map.instance : null
    });

    this.marker = markerInstance;

    markerInstance.addListener('click', () => {
      emitter.emit(EVENTS.EVENT_SELECTED, event);
    });

    markerInstance.addListener('mouseover', () => {
      marker.highlight();
      emitter.emit(EVENTS.EVENT_HIGHLIGHTED, event);
    });

    markerInstance.addListener('mouseout', () => {
      marker.unhighlight();
      emitter.emit(EVENTS.EVENT_UNHIGHLIGHTED, event);
    });

    // Info window
    const infoWindow = new google.maps.InfoWindow({
      content: event.title
    });

    infoWindow.addListener('closeclick', () => {
      emitter.emit(EVENTS.EVENT_DESELECTED);
    });

    this.infoWindow = infoWindow;
  }

  getIcon() {
    const {isActive, isHighlighted} = this;
    const mapZoom = this.map.instance.getZoom();
    const hasTags = this.event.tags && this.event.tags.length > 0;
    let iconUrl = isActive ? (hasTags ? taggedIcon : icon) : inactiveIcon;

    if (isHighlighted) {
      iconUrl = hasTags ? taggedHighlightedIcon : highlightedIcon;
    }

    return {
      scaledSize: {
        width: 15,
        height: 15
      },
      opacity: 1,
      url: iconUrl
    };
  }

  openWindow() {
    this.infoWindow.open(this.map.instance, this.marker);
  }

  closeWindow() {
    this.infoWindow.close();
  }

  highlight() {
    const {marker} = this;
    this.isHighlighted = true;
    marker.setIcon(this.getIcon());
    marker.setZIndex(30);
  }

  unhighlight() {
    const {marker} = this;
    this.isHighlighted = false;
    marker.setIcon(this.getIcon());
    marker.setZIndex(this.isActive ? 2 : 1);
  }

  activate() {
    const {marker} = this;
    this.isActive = true;
    this.isHighlighted = false;
    marker.setIcon(this.getIcon());
    marker.setZIndex(2);
  }

  deactivate() {
    const {marker} = this;
    this.isActive = false;
    this.isHighlighted = false;
    marker.setIcon(this.getIcon());
    marker.setZIndex(1);
  }

  show() {
    this.marker.setVisible(true);
  }

  hide() {
    this.marker.setVisible(false);
  }
}
