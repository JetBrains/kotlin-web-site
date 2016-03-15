define([
  'jquery',
  'com/events-table',
  'com/google-map'
], function ($, EventsTable, EventMap) {
  return function (elem) {
    $(document).ready(function () {
      $.getJSON("/docs/events.json", function (data) {
        new EventsTable(elem, data);
        new EventMap(data)
      });
    });
  };
});