require('./styles.scss');
var template = require('./view.twig');

var $ = require('jquery');

var DEFAULT_LANG = 'en';

/**
 * @param {Object} data
 * @constructor
 */
function Event(data) {
  this.id = data.id;
  this.title = data.title;
  this.url = data.url;
  this.subject = data.subject;
  this.speaker = data.speaker;
  this.description = data.description;

  if (!data.location) {
    console.warn(data.title + ' has no location');
  }

  this.city = data.location;
  this.lang = data.lang || DEFAULT_LANG;
  this.content = data.content;

  if (!(data.date instanceof Date)) {
    this.date = convertToDate(data.date);
    this.formattedDate = formatDate(this.date);

  } else {
    this.date = data.date;
  }
}

/** @type {string} */
Event.prototype.title = null;

/** @type {string} */
Event.prototype.url = null;

/** @type {string} */
Event.prototype.subject = null;

/** @type {string} */
Event.prototype.speaker = null;

/** @type {City} */
Event.prototype.city = null;

/** @type {Array<Date>} */
Event.prototype.date = null;

/** @type {string} */
Event.prototype.formattedDate = null;

/** @type {string} */
Event.prototype.lang = null;

/** @type {Object} Materials */
Event.prototype.content = null;

/** @type {string} */
Event.prototype.description = null;

/** @type {Marker} */
Event.prototype.marker = null;

Event.prototype.isUpcoming = function () {
  var date = this.date;
  var now = new Date();

  return Array.isArray(date) ? date[1] >= now : date >= now;
};

Event.prototype.getBounds = function () {
  return this.city.getBounds();
};

Event.prototype.render = function (mountNode) {
  var rendered = template.render({event: this, mode: 'normal'});

  if (mountNode) {
    var tempElement = document.createElement('div');
    tempElement.innerHTML = rendered;
    var node = tempElement.childNodes[0];
    this.node = node;
    mountNode.appendChild(node);
  }

  return rendered;
};

Event.prototype.renderDetailed = function () {
  return template.render({event: this, mode: 'detailed'});
};


Event.prototype.highlight = function () {
  $(this.node).addClass('_highlighted');
};

Event.prototype.unhighlight = function () {
  $(this.node).removeClass('_highlighted');
};

Event.prototype.show = function () {
  $(this.node).show();
};

Event.prototype.hide = function () {
  $(this.node).hide();
};


function formatDate(date) {
  var formatted = '';
  var isRange = Array.isArray(date) && date.length == 2;
  var nowYear = new Date().getFullYear();
  var year, month, day;

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

function convertToDate(dateStringOrArray) {
  if (Array.isArray(dateStringOrArray) && (typeof dateStringOrArray[0] === 'string')) {
    return [
      new Date(dateStringOrArray[0]),
      new Date(dateStringOrArray[1])
    ];
  } else {
    return new Date(dateStringOrArray);
  }
}

module.exports = Event;