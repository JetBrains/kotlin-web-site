var queryStringUtils = require('query-string');


/**
 * @returns {String}
 */
function getHash() {
  var hashContent = window.location.hash.substr(1);
  return hashContent ? hashContent : null;
}

/**
 * @returns {Object<String, (String)>|null}
 */
function getQuery() {
  var query = null;
  var queryString = getHash();

  if (queryString)
    query = queryStringUtils.parse(queryString);

  return query;
}

function setQuery(query) {
  var serialized = queryStringUtils.stringify(query);
  window.location.hash = '#' + serialized;
}


var router = {};

/**
 * @param {String} param
 * @returns {String|null|undefined} Returns `undefined` if param not presented
 *                                  Returns `null` if param presented but value is missing, e.g. ?param
 */
router.getParam = function (param) {
  var query = this.getParams();
  var value = query ? query[param] : undefined;
  return value;
};


/**
 * @returns {Object.<String, *>|null}
 */
router.getParams = function () {
  return getQuery();
};


/**
 * @param {String} param
 * @returns {Boolean}
 */
router.hasParam = function (param) {
  var query = this.getParams();
  return (query && param in query);
};


/**
 * @param {String} param
 * @param {String} [value=null]
 */
router.setParam = function (param, value) {
  var query = this.getParams() || {};

  if (typeof value === 'undefined')
    value = null;

  query[param] = value;

  setQuery(query);
};


/**
 * @param {Object.<String, *>} params
 */
router.setParams = function(params) {
  setQuery(params);
};


/**
 * @param {String} param
 * @returns {undefined}
 */
router.removeParam = function (param) {
  var query = this.getParams();

  if (query && param in query) {
    delete query[param];
    setQuery(query);
  }
};

router.removeParams = function () {
  history.replaceState('', document.title, window.location.pathname + window.location.search);
};

module.exports = router;


