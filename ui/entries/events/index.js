var util = require('util/common');
var eventTempalte = require('./event/view.twig');
var $ = require('jquery');
var langApi = require('./lang');

require('scrolltofixed/jquery-scrolltofixed.js');
require('./index.scss');

var eventGroups = {};
var mapElement;
var filter;
var langFilter = {
  id: 'lang',
  title: 'Language',
  opened: true,
  values: []
};
mapStyles = [
  {
    featureType: "all",
    "stylers": [
      { "visibility": "on" },
      { "hue": "#0044ff" },
      { "saturation": -80 }
    ]
  },
  {
    "featureType": "road.arterial",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ffffff" }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {"color": "#d1dbe1"},
      {"visibility": "on"}
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#456184" }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      { "weight": 2 }
    ]
  }
];

function KotlinEventGroup(fullCityName, cityCoordinates) {
  var events = [];
  var visible = true;
  var disabled = false;
  var cityName = fullCityName.split(',')[0];
  var marker = null;
  var that = this;

  this.addEvent = function (eventData) {
    var event = new KotlinEvent(eventData, this);
    events.push(event);
    return event;
  };

  this.isDisabled = function () {
    return disabled;
  };

  this.disable = function () {
    disabled = true;
    if (marker != null) {
      marker.setOpacity(0.5);
    }
    events.forEach(function (event) {
      event.checkVisibilityStatus()
    })
  };

  this.enable = function () {
    disabled = false;
    if (marker != null) {
      marker.setOpacity(1);
    }
    events.forEach(function (event) {
      event.checkVisibilityStatus()
    })
  };

  this.onGoogleApiLoaded = function (map) {
    if (cityCoordinates !== undefined) {
      initMarkerAndNote(map, new google.maps.LatLng(cityCoordinates.lat, cityCoordinates.lng))
    }
  };

  this.checkHiddenStatus = function () {
    var numberOfVisibleEvents = events.filter(function (event) {
      return event.isVisible();
    }).length;

    if (numberOfVisibleEvents == 0) {
      hide()
    } else {
      show();
      if (marker != null) marker.setTitle(getTitle())
    }
  };

  function getTitle() {
    var visibleEvents = events.filter(function (event) {
      return event.isVisible();
    });
    return visibleEvents.length + (visibleEvents.length == 1 ? " event in " : " events in ") + cityName;
  }

  function hide() {
    visible = false;
    if (marker != null) {
      marker.setVisible(visible)
    }
  }

  function show() {
    visible = true;
    if (marker != null) {
      marker.setVisible(visible)
    }
  }

  function initMarkerAndNote(map, location) {
    marker = new google.maps.Marker({
      position: location,
      map: map,
      title: getTitle(),
      visible: visible,
      icon: getIcon(map.getZoom())
    });

    marker.addListener("click", function () {
      Object.keys(eventGroups).forEach(function (city) {
        eventGroups[city].disable();
      });
      that.enable();
    });

    map.addListener("zoom_changed", function () {
      marker.setIcon(getIcon(map.getZoom()));
    });
  }

  function getIcon(mapZoom) {
    var opacity = disabled ? 1 : 0.5;
    if (mapZoom <= 5) {
      return {
        scaledSize: {
          width: 16,
          height: 16
        },
        opacity: opacity,
        url: "/assets/images/favicon.ico"
      }
    } else {
      return {
        scaledSize: {
          width: 32,
          height: 32
        },
        opacity: opacity,
        url: "/assets/images/favicon.ico"
      }
    }
  }
}

function KotlinEvent(eventData, eventGroup) {
  this.title = eventData.title;
  this.lang = eventData.lang != null ? eventData.lang : "en";
  this.url = eventData.url;
  this.subject = eventData.subject;
  this.speaker = eventData.speaker;
  this.date = convertToDate(eventData.date);
  this.location = eventData.location;
  this.content = eventData.content !== undefined ? eventData.content : {};
  this.isUpcoming = isUpcoming(this.date);
  this.formattedDate = formatDate(this.date);
  this.$elem = null;

  var visible = false;
  var cityName = eventData.location.split(',')[0];

  this.isVisible = function () {
    return visible
  };

  this.getCityName = function () {
    return cityName;
  };

  this.hide = function () {
    visible = false;
    this.checkVisibilityStatus()
  };

  this.show = function () {
    visible = true;
    this.checkVisibilityStatus()
  };

  this.checkVisibilityStatus = function () {
    if (visible && !eventGroup.isDisabled()) {
      this.$elem.removeClass('hidden');
    } else {
      this.$elem.addClass('hidden');
    }
  };

  this.render = function (parentElement) {
    this.$elem = $(eventTempalte.render({
      event: this
    }));
    $(parentElement).append(this.$elem);
  };

  function isUpcoming(date) {
    var today = new Date();
    if (util.isArray(date)) {
      return date[1] >= today;
    } else {
      return date >= today;
    }
  }

  function convertToDate(dateStringOrArray) {
    if (util.isArray(dateStringOrArray) && (typeof dateStringOrArray[0] === 'string')) {
      return [
        new Date(dateStringOrArray[0]),
        new Date(dateStringOrArray[1])
      ];
    } else {
      return new Date(dateStringOrArray);
    }
  }

  function formatDate(date) {
    var formatted = '',
      isRange = util.isArray(date),
      nowYear = new Date().getFullYear(),
      year, month, day;

    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    if (isRange) {
      month = [
        months[date[0].getMonth()],
        months[date[1].getMonth()]
      ];
      year = [date[0].getFullYear(), date[1].getFullYear()];
      day = [date[0].getDate(), date[1].getDate()];

      if (month[0] !== month[1]) {
        formatted = month[0] + ' ' + day[0] + '-' + month[1] + ' ' + day[1];
      } else {
        formatted = month[0] + ' ' + day[0] + '-' + day[1];
      }

      if (year[0] !== nowYear || year[1] !== nowYear) {
        formatted += ', ' + year[1];
      }
    }
    else {
      year = date.getFullYear();
      month = months[date.getMonth()];
      day = date.getDate();

      formatted = month + ' ' + day;
      if (year !== nowYear) {
        formatted += ', ' + year;
      }
    }

    return formatted;
  }
}

window.initMap = function () {
  var map = new google.maps.Map(mapElement, {
    center: {
      lat: 20,
      lng: 0
    },
    zoom: 2,
    disableDefaultUI: true,
    zoomControl: true,
    styles: mapStyles
  });

  Object.keys(eventGroups).forEach(function (city) {
    eventGroups[city].onGoogleApiLoaded(map)
  });
};

$(document).ready(function () {
  return;
  mapElement = document.getElementById("map");
  $(mapElement).scrollToFixed();

  $.getJSON("/docs/cities.json").done(function (cities) {
    cities.forEach(function (city) {
      eventGroups[city.name] = new KotlinEventGroup(city.name, city.geo)
    })
  }).then(function () {
    return $.getJSON("/docs/events.json");
  }).done(function (eventsData) {
    var events = [];
    var allLanguages = ['en'];
    eventsData.forEach(function (eventData) {
      if (eventData.lang === undefined) {
        eventData.lang = 'en'
      } else{
        allLanguages.push(eventData.lang);
      }

      eventData.location = eventData.location !== undefined ? eventData.location : "unknown";
      if (eventGroups[eventData.location] === undefined) {
        eventGroups[eventData.location] = new KotlinEventGroup(eventData.location);
        if (eventData.location !== "unknown") {
          console.warn("Unknown city: " + eventData.location);
        }
      }
      var eventGroup = eventGroups[eventData.location];
      var event = eventGroup.addEvent(eventData);
      events.push(event);
    });

    events.sort(function (a, b) {
      var dateA = a.date,
        dateB = b.date,
        isADateIsRange = util.isArray(dateA),
        isBDateIsRange = util.isArray(dateB),
        compareA = isADateIsRange ? dateA[1] : dateA,
        compareB = isBDateIsRange ? dateB[1] : dateB;

      if (compareA === compareB) {
        return 0;
      }

      return (compareA < compareB) ? 1 : -1;
    });

    var $upcomingEventsElement = $('.js-upcoming-events');
    events.forEach(function (event) {
      if (!event.isUpcoming) return;
      //event.render($upcomingEventsElement)
    });

    var $pastEventsElement = $('.js-past-events');
    events.forEach(function (event) {
      if (event.isUpcoming) return;
      //event.render($pastEventsElement)
    });

    langFilter.values = $.map($.unique(allLanguages), function (languageCode) {
      return {
        id: languageCode,
        title: langApi.getLanguageName(languageCode),
        test: function (object) {
          return object.lang == languageCode
        }
      }
    });


    Object.keys(eventGroups).forEach(function (city) {
      eventGroups[city].checkHiddenStatus()
    });

    $.getScript("https://maps.googleapis.com/maps/api/js?callback=initMap")
  });
});

$(document).ready(function () {

  var Map = require('./map/Map');
  var EventsStore = require('./event/EventsStore');

  var eventsStorePromise = EventsStore.create('/docs/events.json', '/docs/cities.json');

  eventsStorePromise.then(function (eventsStore) {
    return Map.create(document.getElementById('map'), eventsStore.events)
  }).then(function (map) {
    window.map = map;
  });

});