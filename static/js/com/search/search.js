import $ from "jquery";
import "./search.scss";
import Instantsearch from "instantsearch.js";
import resultTemaplate from "./search-result.mustache"
import UrlUtils from "query-string"


$(document).ready(function () {
  const $searchButton = $('.search-button'),
    $searchPopup = $('.search-popup'),
    $closeButton = $('.search-popup__close'),
    $layout = $('.global-layout');

  const search = Instantsearch({
    appId: '7961PKYRXV',
    apiKey: '604fa45d89af86bdf9eed4cc862b2d0b',
    indexName: 'dev_KOTLINLANG',
    urlSync: {
      trackedParameters: ['query', 'page']
    }
  });

  function openPopup() {
    $searchPopup.removeClass('hidden');
    $layout.addClass('hidden');
    $('.ais-search-box--input').focus();
  }

  function closePopup() {
    search.helper.setQuery('').clearRefinements().search();
    $layout.removeClass('hidden');
    $searchPopup.addClass('hidden');
  }

  $(document).keyup(function (e) {
    // escape key
    if (e.keyCode == 27) {
      closePopup()
    }
  });

  $closeButton.on('click', closePopup);

  $searchButton.on('click touch', openPopup);

  search.addWidget(
    Instantsearch.widgets.searchBox({
      container: '.search-popup__input',
      placeholder: 'Search',
      reset: false,
      magnifier: false,
    })
  );

  search.addWidget(
    Instantsearch.widgets.infiniteHits({
      container: '.search-popup__results',
      templates: {
        empty: 'No results',
        item: resultTemaplate
      }
    })
  );

  search.start();

  const urlParameters = UrlUtils.parse(UrlUtils.extract(window.location.href));
  if('q' in urlParameters && urlParameters.q != ''){
    openPopup();
  }
});