import $ from 'jquery'
import Dropdown from '../../com/dropdown'
import NavTree from '../../com/nav-tree'
import './api.scss'

const DEFAULT_VERSION = '1.3';
const LOCAL_STORAGE_KEY = 'targetApi';

function getVersion(element) {

  let version = $(element).attr('data-kotlin-version');


  return version
}

function updateTagByKind(rowElement, newTag, kind) {
  let tagsContainer = ($(rowElement).is("tr")) ? $(rowElement).find("td:first") : rowElement;
  let $tag = $(tagsContainer).children(`.tags__tag.${kind}`);
  $tag.text(newTag);
}

function hideByTags($elements, state, checkTags) {
  $elements.removeClass('hidden');
  $elements.each((ind, element) => {
      const $element = $(element);

      if(checkTags($element, state.platform)) return;
      $element.addClass('hidden');
  });
}

function updateState(state) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));

  const $versionDependentElements = $('[data-kotlin-version]');
  $versionDependentElements.removeClass('hidden');

  hideByTags($('[data-platform]'), state, ($element, platform) =>
      $element.attr('data-platform').toLowerCase().split(", ").some((tag) => platform.includes(tag))
  );
  hideByTags($('.tags__tag.platform'), state, ($element, platform) => 
    $element.attr("class").split(' ').some((cls) => platform.includes(cls.replace("tag-value-", "").toLowerCase()))
  );


  $versionDependentElements.each((ind, element) => {
    const $element = $(element);
    const stateVersion = state.version ? state.version : DEFAULT_VERSION;
    const version = getVersion(element);
    const pureVersion = version.replace(/\+$/, '');
    if (pureVersion > stateVersion) {
        $element.addClass('hidden');
        if ($element.is("div") && $element.siblings().hasClass("hidden")) {
          $element.parent().parent().addClass("hidden")
        }
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

function addPlatformSelectToPanel(panelElement, config) {
  const selectElement = $(`<div class="api-panel_toggle"></div>`);
  $.each(config.items, (value, item) => {
    const itemElement = $(`<div class="toggle-platform `+value+`"><span>`+item+`</span></div>`);
    selectElement.append(itemElement);
    if (!config.selected.includes(value)) {
      itemElement.addClass('off');
    }
    itemElement.click(() => {
      itemElement.toggleClass('off');
      config.onSelect(value);
    });
  })
  $(panelElement).append(selectElement);

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
  if (state.platform == 'all') {
    state.platform = ['common', 'jvm', 'js', 'native'];
  }
  updateState(state);

  addPlatformSelectToPanel(switchersPanel, {
    items: {
      'common': 'Common',
      'jvm': 'JVM',
      'js': 'JS',
      'native': 'Native'
    },
    selected: state.platform,
    onSelect: (platform) => {
      const index = state.platform.indexOf(platform);
      if (index !== -1) {
        state.platform.splice(index, 1);
      } else {
        state.platform.push(platform);
      }
      console.log(platform);
      console.log(state);
      
      updateState(state);
    }
  });


  addSelectToPanel(switchersPanel, "Version", {
    items: {
      '1.0': '1.0',
      '1.1': '1.1',
      '1.2': '1.2',
      '1.3': '1.3'
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

function addTag(rowElement, tags, kind) {
  // let tagsContainer = ($(rowElement).is("tr")) ? $(rowElement).find("td:first") : rowElement;

  // let $tagsElement = $(tagsContainer).find(".tags");

  
  // if ($tagsElement.length == 0) {
  //   return;
  //   // $tagsElement = $('<div class="tags"></div>');
  //   // let elementWithPlatforms = $(rowElement);
  //   // $(tagsContainer).append($tagsElement);
  // }

  // //if (!$(rowElement).is("tr") && kind != 'platform')
  // //  return;

  // tags.split(',').forEach(tag => $tagsElement.append(`<div class="tags__tag ${kind}">${tag}</div>`));


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
