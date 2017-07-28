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
    searchFunction: (helper) => {
      const searchResults = $('.search-popup__results');
      helper.search();
      if (helper.state.query === '') {
        searchResults.hide();
      } else {
        searchResults.show();
      }
    },
    urlSync: {
      trackedParameters: ['query', 'page']
    }
  });

    search.addWidget(
    Instantsearch.widgets.searchBox({
      container: '.search-popup__input',
      placeholder: 'Type to search',
      reset: false,
      magnifier: false,
    })
  );

  search.on('render', function () {
    $('.ais-infinite-hits--item._active').removeClass('_active');
    $('.ais-infinite-hits--item:first').addClass('_active')
  });

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

  const $input = $('.ais-search-box input');

  function openPopup() {
    $searchPopup.removeClass('_hidden');
    $('body').addClass('_no-scroll');
    $('.ais-search-box--input').focus();
  }

  function closePopup() {
    search.helper.setQuery('').clearRefinements().search();
    $('body').removeClass('_no-scroll');
    $searchPopup.addClass('_hidden');
    $input.val('');
  }

  $searchPopup.keyup(function (e) {
    if (e.keyCode == 27) { // escape key
      closePopup()
    } else if (e.keyCode == 13) { //enter
      window.location.href = $('.ais-infinite-hits--item._active a').attr('href')
    } else if (e.keyCode == 40) { //arrow down
      const $activeElement = $('.ais-infinite-hits--item._active');
      const $nextElement = $activeElement.next();
      if ($nextElement.length > 0) {
        $activeElement.removeClass('_active');
        $nextElement.addClass('_active');

        const popupTop = $nextElement.position().top + $nextElement.outerHeight() - $(window).height();
        if (popupTop > 0) {
          $searchPopup.scrollTop($searchPopup.scrollTop() + popupTop);
        }
      }
    } else if (e.keyCode == 38) { //arrow up
      const $activeElement = $('.ais-infinite-hits--item._active');
      const $prevElement = $activeElement.prev();
      if ($prevElement.length > 0) {
        $prevElement.addClass('_active');
        $activeElement.removeClass('_active');

        const popupTop = $prevElement.position().top;
        if (popupTop < 0) {
          $searchPopup.scrollTop($searchPopup.scrollTop() + popupTop);
        }
      }
    }
  });

  $closeButton.on('click', closePopup);

  $searchButton.on('click touch', openPopup);


  $input.on('blur', function () {
    $input.focus()
  });

  $input.keydown(function (e) {
    if(e.keyCode == 40 || e.keyCode == 38){
      e.preventDefault()
    }
  });

  const urlParameters = UrlUtils.parse(UrlUtils.extract(window.location.href));
  if ('q' in urlParameters && urlParameters.q != '') {
    openPopup();
  }
});