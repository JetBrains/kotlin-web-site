var $ = require('jquery');
window.$ = $;

var Map = require('./map/Map');
var EventsStore = require('./event/EventsStore');
var EventsList = require('./events-list/EventsList');
var emitter = require('../../util/emitter');
var EVENTS = require('./events-list');
var FilterPanel = require('./filter-panel/index');
var Fixer = require('fixer.js');

require('./index.scss');

function refreshMapSize(node, map) {
  var width = Math.floor( $(window).width() / 2 );
  $(node).css('width', width);
  google.maps.event.trigger(map, 'resize');
}

$(document).ready(function () {
  var store;
  var eventsStorePromise = EventsStore.create('/data/events.json', '/data/cities.json');

  eventsStorePromise.then(function (eventsStore) {
    store = eventsStore;
    return Map.create('.js-map', eventsStore);
  })
  .then(function (map) {
    var list = new EventsList('.js-events-list', store);

    list.applyFilteredResults(store.events);

    var panel = new FilterPanel('.js-filter-panel-wrap', {
      languages: store.getLanguages(),
      materials: store.getMaterials(),
      store: store
    });

    panel.onSelect(function (filters) {
      emitter.emit(EVENTS.EVENTS_FILTERED, filters);

      if (list.mode == 'detailed') {
        emitter.emit(EVENTS.EVENT_DESELECTED);
      }
    });

    var node = document.querySelector('.js-events-map-panel-wrap');
    refreshMapSize(node, map.instance);
    var mapPanel = new Fixer().addElement('.js-events-map-panel', {stretchTo: '.global-footer'});
    mapPanel.on('stretched', refreshMapSize.bind(null, node, map.instance));
    $(window).on('resize', refreshMapSize.bind(null, node, map.instance));

    setTimeout(function() {
      panel.timeSelector.select(1);
    }, 300);
  });

});