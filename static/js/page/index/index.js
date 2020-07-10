import $ from 'jquery';
import './index.scss';

const initTabs = function () {
    const $tabs = $('.js-tab');

    $tabs.on('click', function () {
        const $tab = $(this),
            tabId = $tab.attr('data-tab-id');
        if ($tab.hasClass('is_active')) {
            return;
        }

        $tabs.each(function () {
            const $currentTab = $(this),
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

const initPopups = function () {
    const popups =
        {
            init: function () {
                const that = this,
                    $popups = $('.js-popup'),
                    $popupShowButtons = $('.js-popup-open-button'),
                    $popupHideButtons = $('.js-popup-close-button');

                $popupShowButtons.on('click', function (e) {
                    const popupId = this.getAttribute('data-popup-id');

                    e.preventDefault();
                    e.stopPropagation();
                    that.showPopup(popupId);
                });

                $popupHideButtons.on('click', function (e) {
                    const popupId = this.getAttribute('data-popup-id');

                    e.stopPropagation();
                    that.hidePopup(popupId);
                });

                $(document.body).on('click', function () {
                    $popups.each(function () {
                        const $popup = $(this),
                            popupId = this.id;

                        if (!$popup.hasClass('_hidden')) {
                            that.hidePopup(popupId);
                        }
                    });
                });

                $popups.on('click', '.popup-content', function (e) {
                    e.stopPropagation();
                })
            },

            showPopup: function (id) {
                const $popupNode = $('#' + id);

                $popupNode.removeClass('_hidden');
            },

            hidePopup: function (id) {
                const $popupNode = $('#' + id);

                $popupNode.addClass('_hidden');

                if ($popupNode[0].hasAttribute('data-popup-hide-reinit')) {
                    const html = $popupNode.html();
                    $popupNode.html(html);
                }
            }
        };

    popups.init();
};

const initAnchors = function () {
    $('.smooth-anchor').on('click', function(e) {
        const id = (e.target.getAttribute('href') || '').substring(1);
        if (id) {
            const el = $('#' + id)[0];
            if (el) {
                e.preventDefault();
                el.scrollIntoView({behavior: 'smooth'});
            }
        }
    })
};

$(function () {
    initPopups();
    initTabs();
    initAnchors();
});