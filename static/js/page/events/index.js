import $ from "jquery";
import Fixer from "fixer.js";
import queryUtils from 'query-string';
import Map from "./map/Map";
import EventsStore from "./event/EventsStore";
import EventsList from "./events-list/EventsList";
import emitter from "../../util/emitter";
import EVENTS from "./events-list";
import FilterPanel from "./filter-panel/index";
import timeSelectValues from './filter-panel/time-select-items';

require('./index.scss');

function refreshMapSize(node, map) {
  const width = Math.floor( $(window).width() / 2 );
  $(node).css('width', width);
  google.maps.event.trigger(map, 'resize');
}

$(document).ready(() => {
  const query = queryUtils.parse(window.location.search);
  const {time} = query;

  const initialFilters = {
    time: time in timeSelectValues ? time : 'all',
    lang: 'all',
    materials: 'all'
  };

  let store;
  const eventsStorePromise = EventsStore.create('/data/events.json', '/data/cities.json');

  eventsStorePromise.then(eventsStore => {
    store = eventsStore;
    return Map.create('.js-map', eventsStore);
  })
  .then(map => {
    const events = store.filter(initialFilters);
    const list = new EventsList('.js-events-list', store, initialFilters);

    emitter.emit(EVENTS.EVENTS_FILTERED, initialFilters);
    // list.applyFilteredResults(events);

    const panel = new FilterPanel('.js-filter-panel-wrap', {
      languages: store.getLanguages(),
      materials: store.getMaterials(),
      store: store,
      initialFilters
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
  });

});