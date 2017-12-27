import $ from 'jquery'
import Dropdown from '../../com/dropdown'
import NavTree from '../../com/nav-tree'
import './api.scss'

const DEFAULT_VERSION = '1.2';
const LOCAL_STORAGE_KEY = 'targetApi';

function getVersion(element) {
  let version = $(element).attr('data-kotlin-version');
  if (version.startsWith("Kotlin ")) {
    version = version.substring("Kotlin ".length)
  }
  return version
}

function updateTagByKind(rowElement, newTag, kind) {
  let $tag = $(rowElement).find(`.tags__tag.${kind}`);
  $tag.text(newTag);
}

function updateState(state) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  const $platformDependentElements = $('[data-platform]');
  const $versionDependentElements = $('[data-kotlin-version]');
  $versionDependentElements.removeClass('hidden');
  $platformDependentElements.removeClass('hidden');

  if (state.platform.toLowerCase() != 'all') {
    $platformDependentElements.each((ind, element) => {
      const $element = $(element);
      if ($element.attr('data-platform').toLowerCase() == state.platform.toLowerCase()) return;
      $element.addClass('hidden')
    })
  }

  $versionDependentElements.each((ind, element) => {
    const $element = $(element);
    const stateVersion = state.version ? state.version : DEFAULT_VERSION;
    const version = getVersion(element);
    const pureVersion = version.replace(/\+$/, '');
    if (pureVersion > stateVersion) {
      $element.addClass('hidden');
    } else if (version != pureVersion) {
      updateTagByKind($element, pureVersion == stateVersion ? pureVersion : version, 'kotlin-version');
    }
  })
}

function addSelectToPanel(panelElement, title, config) {
  const selectElement = $(`<div class="api-panel__select"><span class="api-panel__dropdown-title">${title}</span></div>`);
  $(panelElement).append(selectElement);
  new Dropdown(selectElement, config);
}

function initializeSelects() {
  const $breadcrumbs = $('.api-docs-breadcrumbs');
  if ($breadcrumbs.length > 0) {
    $breadcrumbs
      .wrap('<div class="api-page-panel"></div>')
      .after('<div class="api-panel__switchers"></div>');
  } else {
    $('.page-content').prepend('<div class="api-page-panel"><div class="api-docs-breadcrumbs"></div><div class="api-panel__switchers"></div></div>');
  }

  const switchersPanel = $('.api-panel__switchers')[0];

  const state = localStorage.getItem(LOCAL_STORAGE_KEY) ?
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) :
    {
      platform: 'all'
    };
  updateState(state);

  addSelectToPanel(switchersPanel, "Platform", {
    items: {
      'all': 'All',
      'jvm': 'JVM',
      'js': 'JS'
    },
    selected: state.platform,
    onSelect: (platform) => {
      state.platform = platform;
      updateState(state)
    }
  });


  addSelectToPanel(switchersPanel, "Version", {
    items: {
      '1.0': '1.0',
      '1.1': '1.1',
      '1.2': '1.2'
    },
    selected: state.version != null ? state.version : DEFAULT_VERSION,
    onSelect: (version) => {
      if(version != DEFAULT_VERSION){
        state.version = version;
      } else {
        delete state.version;
      }
      updateState(state)
    }
  })
}

function addTag(rowElement, tag, kind) {
  let $tagsElement = $(rowElement).find('.tags');
  if ($tagsElement.length == 0) {
    $tagsElement = $('<div class="tags"></div>');
    $(rowElement).find('td:first').append($tagsElement);
  }
  $tagsElement.append(`<div class="tags__tag ${kind}">${tag}</div>`)
}

function addTags() {
  $('[data-platform]').each((ind, element) => {
    const platform = element.getAttribute('data-platform');
    addTag(element, platform, 'platform')
  });

  $('[data-kotlin-version]').each((ind, element) => addTag(element, getVersion(element), 'kotlin-version'));

  $('[data-jre-version]').each((ind, element) => {
    const version = element.getAttribute('data-jre-version');
    addTag(element, version, 'jre-version')
  });
}

$(document).ready(() => {
  addTags();
  initializeSelects();
  new NavTree(document.querySelector('.js-side-tree-nav'));
});
