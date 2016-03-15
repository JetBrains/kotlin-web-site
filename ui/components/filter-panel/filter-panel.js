// require('../checkbox');
require('./filter-panel.scss');
var template = require('./filter-panel.nunj');

// require('components/icon/arrow');
// require('components/icon/close');

var $ = require('jquery');
var router = require('../../utils/router');

function arrayContainsAll(source, target) {
  var result = source.filter(function (item) {
    return target.indexOf(item) > -1
  });
  return (result.length === target.length);
}

var CLASSES = {
  MATCH_FILTER: 'is-match-filter',
  NOT_MATCH_FILTER: 'is-not-match-filter'
};

/**
 * @param config
 * @returns {FilterPanel}
 * @constructor
 */

function FilterPanel(config) {
  if (!(this instanceof FilterPanel))
    return new FilterPanel(config);

  this.init(config);

  this.onFilter(function () {
    var query = this._getQuery();
    this.doFilter(query);
  }.bind(this));

  this.doFilter(this._getQuery());
}

FilterPanel.prototype.init = function (config) {
  this.config = config;
  var $mountNode = $(config.mountNode);
  this.objectsToFilter = config.objectsToFilter;
  var query = router.getParams();

  if (query) {
    config.filters.forEach(function (filter) {
      if (query.hasOwnProperty(filter.id)) {
        filter.opened = true;

        filter.values.forEach(function (value) {
          value.checked = query[filter.id].indexOf(value.id) !== -1;
        })
      } else {
        filter.values.forEach(function (value) {
          value.checked = false;
        })
      }
    })
  }

  var $panel = this.$panel = $(template.render({
    filters: config.filters,
    title: config.title
  }));

  this._createFilterMap();

  config.filters.forEach(function (filter) {
    filter.values.forEach(function (value) {
      if (typeof value.checked === 'undefined')
        value.checked = false;
    })
  });

  $panel.find('.js-filter-switch input').on('change', function () {
    var filterId = this.getAttribute('data-filter-name');
    var filterValue = this.getAttribute('data-filter-value');
    var isChecked = this.checked;

    config.filters
      .filter(function (filter) {
        return filter.id === filterId
      })
      .forEach(function (value) {
        value.values.forEach(function (value) {
          if (value.id === filterValue)
            value.checked = isChecked;
        })
      });

    $panel.trigger('filter', {
      filter: filterId,
      value: filterValue,
      isChecked: isChecked
    });
  });

  $panel.find('.js-group-title').on('click', function () {
    $(this).parent().toggleClass('_is-opened');
  });

  $panel.find('.js-reset-button').on('click', this.reset.bind(this));

  $mountNode.append($panel);
};

FilterPanel.prototype.setFilterValue = function (filterName, filterValue, isChecked) {
  var $checkbox = this.$panel.find("[data-filter-name='" + filterName + "'][data-filter-value='" + filterValue + "']");
  $checkbox.attr("checked", isChecked);
  $checkbox.change();
};

FilterPanel.prototype._createFilterMap = function () {
  var map = [];
  var config = this.config;

  this.objectsToFilter.forEach(function (object) {
    var filters = {};

    config.filters.forEach(function (filter) {
      var valuesIds = [];
      filter.values.forEach(function (value) {
        if (value.test(object)) valuesIds.push(value.id)
      });

      filters[filter.id] = valuesIds;
    });

    map.push({
      object: object,
      filters: filters
    });
  });

  this._map = map;
};

FilterPanel.prototype._getQuery = function () {
  var query = {};
  var c = 0;

  this.config.filters.forEach(function (filter) {
    var filterId = filter.id;
    filter.values.forEach(function (value) {
      if (value.checked === true) {
        if (typeof query[filterId] === 'undefined') query[filterId] = [];
        query[filterId].push(value.id);
        c++;
      }
    })
  });

  return c > 0 ? query : null;
};

FilterPanel.prototype._find = function (query) {
  var found = [];

  this._map.forEach(function (elem) {
    var object = elem.object;
    var data = elem.filters;
    var isMatch = false;
    var matchCount = 0;

    if (query) {
      var mustMatchCount = Object.keys(query).length;

      Object.keys(query).forEach(function (queryParam) {
        if (queryParam in data) {
          if (arrayContainsAll(data[queryParam], query[queryParam]))
            matchCount++;
        }
      });

      isMatch = matchCount === mustMatchCount;
    }
    else
      isMatch = true;

    isMatch && found.push(object);
  });

  return found;
};

FilterPanel.prototype.doFilter = function (query) {
  var that = this;
  var found = this._find(query);
  var scrollTop = document.body.scrollTop;

  // filtering target objects
  this._map.forEach(function (elem) {
    var object = elem.object;
    var isMatch = found.indexOf(object) !== -1;

    if (isMatch) {
      object.show()
    } else {
      object.hide()
    }
  });

  // enable/disable checkboxes
  this.$panel.find('.js-filter-switch input').each(function () {
    var $node = $(this);
    var filterName = this.getAttribute('data-filter-name');
    var value = this.getAttribute('data-filter-value');

    if (!query) {
      $node.attr('disabled', false);
      return;
    }

    var futureQuery = $.extend(true, {}, query);

    if (filterName in query && query[filterName].indexOf(value) === -1)
      futureQuery[filterName].push(value);
    else if (!(filterName in query))
      futureQuery[filterName] = [value];

    var found = that._find(futureQuery);
    var disabled = found.length === 0;
    $node.attr('disabled', disabled);
  });

  var $resetButton = this.$panel.find('.js-reset-button');
  query === null ? $resetButton.addClass('_is-hidden') : $resetButton.removeClass('_is-hidden');

  router.setParams(query);

  if (!query) {
    document.body.scrollTop = scrollTop;
  }
};

FilterPanel.prototype.reset = function () {
  this.config.filters.forEach(function (filter) {
    filter.values.forEach(function (value) {
      value.checked = false;
    })
  });

  this.$panel.find('.js-filter-switch input').attr('checked', false);
  this.doFilter(null);
  router.removeParams();
};

FilterPanel.prototype.onFilter = function (callback) {
  this.$panel.on('filter', callback.bind(this));
};

module.exports = FilterPanel;