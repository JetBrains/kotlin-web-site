require('./styles.scss');

var $ = require('jquery');
var template = require('./view.twig');

/**
 * @param {EventsStore} store
 * @constructor
 */
function EventsList(store) {
  this.store = store;
  this.currentFilters = null;
}

EventsList.prototype.render = function () {
  var $content = $(template.render());

  var upcoming = this.store.getUpcoming();
  var past = this.store.getPast();
  var $upcoming = $content.find('.js-upcoming-events');
  var $past = $content.find('.js-past-events');

  if (upcoming.length > 0) {
    $upcoming.append(upcoming.map(function (event) {
      return event.render();
    }));
  } else {
    $content.find('.js-upcoming-events-group').hide();
  }

  $past.append(past.map(function (event) {
    return event.render();
  }));

  $('.js-events-list-col').html($content);
};

EventsList.prototype.filter = function () {

};

module.exports = EventsList;