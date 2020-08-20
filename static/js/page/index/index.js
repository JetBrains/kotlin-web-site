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

const hoverPlatformMenu = function () {
    const $platformMenuItem = $('.nav-item-platforms');
    const $platformMenu = $('.platforms-menu');

    $platformMenuItem.on('mouseenter', function () {
        $platformMenu.fadeIn(300);
    });

    $platformMenuItem.on('mouseleave', function () {
        $platformMenu.fadeOut(300);
    });
};

const initNavItem = function () {
    const $navItems = $('.nav-item');

    $navItems.on('click', function () {
        const $navItem = $(this),
            navItemId = $navItem.attr('data-tab-id');
        if ($navItem.hasClass('nav-item-platforms')) {
            return;
        }

        if ($navItem.hasClass('is_active')) {
            return;
        }

        $navItems.each(function () {
            const $currentNavItem = $(this),
                currentNavItemId = $currentNavItem.attr('data-tab-id'),
                $navItemContentNode = $('#' + currentNavItemId);

            if (navItemId === currentNavItemId) {
                $currentNavItem.addClass('nav-item-is_active');
                $navItemContentNode.removeClass('is_hidden');
            } else {
                $currentNavItem.removeClass('is_active');
                $navItemContentNode.addClass('is_hidden');
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
    $('.smooth-anchor').on('click', function (e) {
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
    hoverPlatformMenu();
    initNavItem();
    initTabs();
    initAnchors();
});