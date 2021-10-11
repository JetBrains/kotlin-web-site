import $ from "jquery";
import "./search.scss";
import algoliasearch from "algoliasearch/lite";
import instantsearch from "instantsearch.js/es";
import {configure, searchBox, infiniteHits} from "instantsearch.js/es/widgets";

import resultTemplate from "./search-result.mustache"
import emptyResultsTemplate from "./empty-result.mustache"
import UrlUtils from "query-string"
import debounce from 'debounce';

const searchDelay = 300;

const KEYS = {
  UP: 38,
  DOWN: 40,
  ENTER: 13,
  ESC: 27
};

let isInited = false;
let search;
let $searchPopup;

export function openPopup() {
  if (!isInited) {
    search.start();
    isInited = true;
  }

  $searchPopup.one('transitionend', () => $('.ais-SearchBox-input').focus());

  $searchPopup.addClass('_visible');
  $('body').addClass('_no-scroll');
}

export function initSearch() {
  $searchPopup = $('.search-popup');
  const $closeButton = $('.search-popup__close');

  search = instantsearch({
    indexName: indexName,
    searchClient: algoliasearch('7961PKYRXV', '604fa45d89af86bdf9eed4cc862b2d0b'),
    searchFunction: debounce((helper) => {
      const searchResults = $('.search-popup__results');

      helper.search();
      if (helper.state.query === '') {
        searchResults.hide();
      } else {
        searchResults.show();
      }
    }, searchDelay),
    routing: {
      stateMapping: {
        stateToRoute(uiState) {
          const indexUiState = uiState[indexName];
          return {
            q: indexUiState.query,
            p: indexUiState.page
          };
        },
        routeToState(routeState) {
          return {
            [indexName]: {
              query: routeState.q,
              page: routeState.p
            }
          }
        }
      }
    }
  });

  search.addWidgets([
      configure({
        attributesToSnippet: ['content:90'],
        snippetEllipsisText: '...',
        typoTolerance: true
      }),
      searchBox({
        container: '.search-popup__input',
        placeholder: 'Search',
        showReset: false,
        showSubmit: false,
        showLoadingIndicator: false
      }),
      infiniteHits({
        container: '.search-popup__results',
        templates: {
          empty: emptyResultsTemplate,
          item: resultTemplate
        }
      })
    ]
  );

  search.on('render', function () {
    $('.ais-InfiniteHits-item._active').removeClass('_active');
    $('.ais-InfiniteHits-item:first').addClass('_active')
  });

  function closePopup() {
    search.helper.setState({focused: false, query: undefined});
    $('body').removeClass('_no-scroll');
    $searchPopup.removeClass('_visible');
  }

  $searchPopup.keyup(function (e) {
    handlerKeysEvent();
    if (e.keyCode === KEYS.ESC) { // escape key
      closePopup()
    } else if (e.keyCode === KEYS.ENTER) { //enter
      const searchRef = $('.ais-InfiniteHits-item._active a').attr('href');
      if (searchRef !== undefined) {
        window.location.href = searchRef;
      }
    } else if (e.keyCode === KEYS.DOWN) { //arrow down
      const $activeElement = $('.ais-InfiniteHits-item._active');
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
      const $activeElement = $('.ais-InfiniteHits-item._active');
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

  $closeButton.on('click', event => {
    event.stopPropagation();
    closePopup();
  });

  $(".search-popup").click(function () {
    $(".ais-SearchBox-input").select();
  });

  const urlParameters = UrlUtils.parse(UrlUtils.extract(window.location.href));

  if ('q' in urlParameters && urlParameters.q !== '') {
    openPopup();
  }
}

function handlerKeysEvent() {
  $(".ais-SearchBox-input").keydown(function (e) {
    if (e.keyCode === KEYS.DOWN || e.keyCode === KEYS.UP) {
      e.preventDefault()
    }
  })
}
