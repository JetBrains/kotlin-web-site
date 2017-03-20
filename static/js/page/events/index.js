import $ from "jquery";
import Map from "./map/Map";
import EventsStore from "./event/EventsStore";
import EventsList from "./events-list/EventsList";
import emitter from "../../util/emitter";
import EVENTS from "./events-list";
import FilterPanel from "./filter-panel/index";
import Fixer from "fixer.js";

require('./index.scss');

function refreshMapSize(node, map) {
  const width = Math.floor( $(window).width() / 2 );
  $(node).css('width', width);
  google.maps.event.trigger(map, 'resize');
}

$(document).ready(() => {
  let store;
  const eventsStorePromise = EventsStore.create('/data/events.json', '/data/cities.json');

  eventsStorePromise.then(eventsStore => {
    store = eventsStore;
    return Map.create('.js-map', eventsStore);
  })
  .then(map => {
    const list = new EventsList('.js-events-list', store);

    list.applyFilteredResults(store.events);

    const panel = new FilterPanel('.js-filter-panel-wrap', {
      languages: store.getLanguages(),
      materials: store.getMaterials(),
      store: store
    });

    panel.onSelect(filters => {
      emitter.emit(EVENTS.EVENTS_FILTERED, filters);

      if (list.mode == 'detailed') {
        emitter.emit(EVENTS.EVENT_DESELECTED);
      }
    });

    const node = document.querySelector('.js-events-map-panel-wrap');
    refreshMapSize(node, map.instance);
    const mapPanel = new Fixer().addElement('.js-events-map-panel', {stretchTo: '.global-footer'});
    mapPanel.on('stretched', refreshMapSize.bind(null, node, map.instance));
    $(window).on('resize', refreshMapSize.bind(null, node, map.instance));

    setTimeout(() => panel.timeSelector.select(1), 300);
  });

});