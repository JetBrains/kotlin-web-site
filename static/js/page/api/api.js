require('./api.scss');
const Dropdown = require('../../com/dropdown');
const $ = require('jquery');

function getVersion(element) {
  let version = $(element).attr('data-kotlin-version');
  if (version.startsWith("Kotlin ")) {
    version = version.substring("Kotlin ".length)
  }
  return version
}

function updateState(state) {
  localStorage.setItem("apiState", JSON.stringify(state));
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
    const version = getVersion(element);
    if (version <= state.version) return;
    $element.addClass('hidden')
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

  const state = localStorage.getItem("apiState") ?
    JSON.parse(localStorage.getItem("apiState")) :
    {
      platform: 'all',
      version: '1.1'
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
      '1.1': '1.1'
    },
    selected: state.version,
    onSelect: (version) => {
      state.version = version;
      updateState(state)
    }
  })
}

function addTag(rowElement, tag) {
  let $tagsElement = $(rowElement).find('.tags');
  if ($tagsElement.length == 0) {
    $tagsElement = $('<div class="tags"></div>');
    $(rowElement).find('td:first').append($tagsElement);
  }
  $tagsElement.append(`<div class="tags__tag">${tag}</div>`)
}

function addTags() {
  $('[data-platform]').each((ind, element) => {
    const platform = element.getAttribute('data-platform');
    addTag(element, platform)
  });

  $('[data-kotlin-version]').each((ind, element) => addTag(element, getVersion(element)));

  $('[data-jre-version]').each((ind, element) => {
    const platform = element.getAttribute('data-jre-version');
    addTag(element, platform)
  });
}

$(document).ready(() => {
  initializeSelects();
  addTags()
});
