var eventTemplate = require('./event-item.twig');
var $ = require('jquery');

function KotlinEvent(title) {

}

function EventsList() {

}


document.onload(function () {
  $.getJSON('/docs/events.json', function (data) {

  })
});

