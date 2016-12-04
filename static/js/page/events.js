var EventsTable = require('../com/events-table');
var $ = require('jquery');

$(document).ready(function () {
  $.getJSON("/data/events.json", function (data) {
    new EventsTable(document.getElementById('events'), data);
  });
});