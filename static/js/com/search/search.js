import $ from "jquery";
import "./search.scss";
import Instantsearch from "instantsearch.js";
import resultTemaplate from "./search-result.mustache"
import emptyResultsTemaplate from "./empty-result.mustache"
import UrlUtils from "query-string"
import debounce from 'debounce';

const searchDelay = 300;

const KEYS = {
  UP: 38,
  DOWN: 40,
  ENTER: 13,
  ESC: 27
};

export function initSearch() {
  const $searchPopup = $('.search-popup');
  const $closeButton = $('.search-popup__close');

  let isInited = false;

  const search = Instantsearch({
    appId: '7961PKYRXV',
    apiKey: '604fa45d89af86bdf9eed4cc862b2d0b',
    indexName: indexName,
    searchParameters: {
      attributesToSnippet: ['content:90'],
      snippetEllipsisText: '...',
      typoTolerance: true
    },
    searchFunction: debounce((helper) => {
      const searchResults = $('.search-popup__results');

      helper.search();
      if (helper.state.query === '') {
        searchResults.hide();
      } else {
        searchResults.show();
      }
    }, searchDelay),
    urlSync: {
      trackedParameters: ['query', 'page']
    }
  });

  search.addWidget(
    Instantsearch.widgets.searchBox({
      container: '.search-popup__input',
      placeholder: 'Search',
      reset: false,
      magnifier: false
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
        empty: emptyResultsTemaplate,
        item: resultTemaplate
      }
    })
  );

  const $input = $('.ais-search-box input');

  function openPopup() {
    if (!isInited) {
      search.start();
      isInited = true;
    }

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
    handlerKeysEvent();
    if (e.keyCode === KEYS.ESC) { // escape key
      closePopup()
    } else if (e.keyCode === KEYS.ENTER) { //enter
      const searchRef = $('.ais-infinite-hits--item._active a').attr('href');
      if (searchRef !== undefined) {
        window.location.href = searchRef;
      }
    } else if (e.keyCode === KEYS.DOWN) { //arrow down
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
    } else if (e.keyCode === 38) { //arrow up
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

  $(".search-popup").click(function () {
    $(".ais-search-box--input").select();
  });

  const urlParameters = UrlUtils.parse(UrlUtils.extract(window.location.href));

  if ('q' in urlParameters && urlParameters.q !== '') {
    openPopup();
  }

  return { openPopup };
}

function handlerKeysEvent() {
  $(".ais-search-box--input").keydown(function (e) {
    if (e.keyCode === KEYS.DOWN || e.keyCode === KEYS.UP) {
      e.preventDefault()
    }
  })
}
