import $ from 'jquery';
import 'whatwg-fetch';
import kotlinPlayground from 'kotlin-playground';
import { createElement } from 'react';
import { hydrate } from 'react-dom';
import '@jetbrains/kotlin-web-site-ui/dist/header.css';
import { initSearch } from '../com/search/search';
import '../com/cities-banners';
import GifPlayer from '../com/gif-player/gif-player';
import CodeMirror from '../com/codemirror/CodeMirror';
import './code-blocks';
import '../com/head-banner';

function trackEvent(event) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'GAEvent',
    ...event,
  });
}

window.trackEvent = trackEvent;

function initSamples () {
  $('.sample').each(function(i, el) {
    const kotlinPlaygroundEvents = {
      onChange: function onChange(code) { $(el).trigger('kotlinPlaygroundChange', code) },
      onRun: function onRun() { $(el).trigger('kotlinPlaygroundRun') },
      callback: function(from, to) { $(el).trigger('kotlinPlaygroundMount', { from, to }) }
    };

    kotlinPlayground(el, kotlinPlaygroundEvents);
  });
}

function initOverviewCodeExample() {
  $('.kotlin-overview-code-example')
      .on('kotlinPlaygroundMount', function({ target }) {
        $(target).data('kotlinOriginalCode', target.KotlinPlayground.view.getCode());
      })
      .on('kotlinPlaygroundRun', function({ target }) {
        const code = target.KotlinPlayground.view.getCode();
        const originalCode = $(target).data('kotlinOriginalCode');

        trackEvent({
          'eventCategory': 'kotlin-playground',
          'eventAction': 'Playground Run',
          'eventLabel': code === originalCode ? 'unchanged' : 'changed',
        });
      });
}

function addNavigatorType() {
  const html = document.getElementsByTagName('html')[0];

  html.className = html.className.replace('no-js', '');

  // OS detection
  if (navigator.userAgent.indexOf('Linux') > -1)
    html.className += ' os_linux';

  // Browser detection
  if ('chrome' in window)
    html.className += ' ua_chrome';
  else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
    html.className += ' ua_firefox';
}

function initHeadingAnchors() {
  $('h1,h2,h3').each(function (element) {
    const id = this.getAttribute("id");
    if (id == null) return;
    const referenceElement = document.createElement("a");
    referenceElement.className = "anchor";
    referenceElement.href = "#" + id;
    this.appendChild(referenceElement);
  });
}

function initGifPlayer() {
  const elements = document.getElementsByClassName("gif-image");
  Array.prototype.forEach.call(elements, function(el) {
    new GifPlayer(el)
  });
}

// Handle with platforms menu in header
const hoverSolutionsMenu = function () {
  const $solutionsMenuItem = $('.nav-item-solutions');
  const $solutionsMenu = $('.solutions-menu');

  $solutionsMenuItem.hover(
      function () { $solutionsMenu.stop(true).delay(500).fadeIn(300); },
      function () { $solutionsMenu.stop(true).fadeOut(300); }
  );
};

function getKTLComponentsComments(node) {
  const comment = ' ktl_component: ';

  const result = [];
  let currentNode = null;

  const iterator = document.createNodeIterator(node || document.body, NodeFilter.SHOW_ALL);

  while (currentNode = iterator.nextNode()) {
    if (currentNode.nodeType === 8) {
      const { nodeValue } = currentNode;

      if(nodeValue.startsWith(comment)) {
        const { name, props } = JSON.parse(nodeValue.substring(comment.length));

        result.push({
          name: name,
          props: props,
          node: currentNode,
        });
      }
    }
  }

  return result;
}

function initKTLComponent(node, name, props) {
  import(`@jetbrains/kotlin-web-site-ui/dist/${name}.js`)
      .then(({ default: Component }) => {
        const fake_node = document.createElement('div');
        hydrate(createElement(Component, props), fake_node);
        node.replaceWith(fake_node); // TODO: preact render to node
      });
}

$(function () {
  CodeMirror.colorize($('.code._highlighted'));

  // hack to force :active support in mobile Safari
  document.addEventListener("touchstart", function () {}, false);

  initSamples();
  initOverviewCodeExample();
  addNavigatorType();
  initHeadingAnchors();
  initGifPlayer();

  const { openPopup } = initSearch();

  getKTLComponentsComments().forEach(({ name, node, props }) => {
    if (name === 'header') initKTLComponent(node.nextElementSibling, name, {
      ...props,
      onSearchClick: openPopup,
    });
  });

  hoverSolutionsMenu();
});
