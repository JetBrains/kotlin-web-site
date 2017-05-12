const $ = require('jquery');

var initTabs = function () {
  var $tabs = $('.js-tab');

  $tabs.on('click', function () {
    var $tab = $(this),
      tabId = $tab.attr('data-tab-id');

    if ($tab.hasClass('is_active')) {
      return;
    }

    $tabs.each(function () {
      var $currentTab = $(this),
        currentTabId = $currentTab.attr('data-tab-id'),
        $tabContentNode = $('#' + currentTabId);

      if (tabId === currentTabId) {
        $currentTab.addClass('is_active');
        $tabContentNode.removeClass('is_hidden');
      } else {
        $currentTab.removeClass('is_active');
        $tabContentNode.addClass('is_hidden');
      }
    });
  });
};

var initPopups = function () {
  var popups =
  {
    init: function () {
      var that = this,
        $popups = $('.js-popup'),
        $popupShowButtons = $('.js-popup-open-button'),
        $popupHideButtons = $('.js-popup-close-button');

      $popupShowButtons.on('click', function (e) {
        var popupId = this.getAttribute('data-popup-id');

        e.stopPropagation();
        that.showPopup(popupId);
      });

      $popupHideButtons.on('click', function (e) {
        var popupId = this.getAttribute('data-popup-id');

        e.stopPropagation();
        that.hidePopup(popupId);
      });

      $(document.body).on('click', function () {
        $popups.each(function () {
          var $popup = $(this),
            popupId = this.id;

          if (!$popup.hasClass('_hidden')) {
            that.hidePopup(popupId);
          }
        });
      });

      $popups.on('click', function (e) {
        e.stopPropagation();
      })
    },

    togglePopup: function (id) {
      var that = this,
        $popupNode = $('#' + id);

      if ($popupNode.hasClass('_hidden')) {
        that.showPopup(id);
      } else {
        that.hidePopup(id);
      }
    },

    showPopup: function (id) {
      var $popupNode = $('#' + id);

      $popupNode.removeClass('_hidden');
    },

    hidePopup: function (id) {
      var $popupNode = $('#' + id);

      $popupNode.addClass('_hidden');
    }
  };

  popups.init();
};

$(document).ready(function () {
  initPopups();
  initTabs();
});