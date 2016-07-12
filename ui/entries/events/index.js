var $ = require('jquery');

var Map = require('./map/Map');
var EventsStore = require('./event/EventsStore');
var EventsList = require('./events-list/EventsList');
var emitter = require('../../utils/emitter');
var EVENTS = require('./events-list');
var FilterPanel = require('./filter-panel');

require('scrolltofixed/jquery-scrolltofixed.js');
require('./index.scss');

function refreshMapSize(map, list) {
  var $mapNode = $(map.node);
  var $mapParent = $mapNode.parent();
  var $mapCol = $mapParent.parent();

  var scrollTop = $(window).scrollTop();
  var viewportHeight = $(window).height();
  var mapTopPosition = $mapCol.offset().top;
  var isMapOverTheViewport = scrollTop > mapTopPosition;
  var isNeedToBeFixed = isMapOverTheViewport;

  var width = Math.floor( $(window).width() / 2 );
  var height = isMapOverTheViewport
    ? viewportHeight
    : ( viewportHeight - (mapTopPosition - scrollTop) );

  var styles = {
    width: width,
    height: height
  };

  if (isNeedToBeFixed && list.mode != 'detailed') {
    styles.position = 'fixed';
    styles.top = '0';
  } else {
    styles.position = 'relative';
  }

  $mapParent.css(styles);
  google.maps.event.trigger(map.instance, 'resize');
}

$(document).ready(function () {
  var store;
  var eventsStorePromise = EventsStore.create('/docs/events.json', '/docs/cities.json');

  eventsStorePromise.then(function (eventsStore) {
    store = eventsStore;
    return Map.create('.js-map', eventsStore);
  })
  .then(function (map) {
    window.map = map;

    var list = new EventsList('.js-events-list', store);

    var panel = new FilterPanel('.js-events-map-panel', {
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

    refreshMapSize(map, list);
    $(window).on('scroll resize', refreshMapSize.bind(null, map, list));
  });

});