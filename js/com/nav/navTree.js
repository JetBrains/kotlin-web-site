define([
    'jquery',
    'util/render',
    'util/localStorage'
], function ($, render, storage) {

    function NavTree(elem, items) {
        var that = this,
            rendered;

        that.elem = elem;

        that.navId = (elem.id) ? elem.id : null;

        //rendered = render(that.templates.main(items));
        //elem.appendChild(rendered);

        that._initEvents();
    }

    NavTree.STORAGE_RECORD_NAME = 'active_nav_items';

    NavTree.prototype.elem = null;

    NavTree.prototype.navId = null;

    NavTree.prototype.templates = {
        main: function (data) {
            var that = this;
            var t =
                ['.page-tree-nav',
                    data.map(function (group) {
                        return that.group(group)
                    })
                ];
            return [t];
        },

        group: function (group) {
            var that = this;
            var hasContent = group.hasOwnProperty('content') && group.content.length > 0;
            var t =
                ['.nav-item._expandable',
                    ['.nav-item-text', {'data-id': group.title}, group.title],
                    hasContent ? that.groupItemsList(group.content) : null
                ];
            return t;
        },

        groupItemsList: function(items) {
            var t =
                ['.subnav-items-list',
                    items.map(function (item) {
                        for (var link in item) {
                            var linkTitle = item[link];
                            break;
                        }
                        return ['.subnav-items-list-item',
                            ['a.text', {href: link}, linkTitle]
                        ];
                })];
            return t;
        }
    };

    NavTree.prototype._initEvents = function() {
        var that = this,
            currentUrl = window.location.href,
            $elem = $(that.elem),
            $groupItems = $elem.find('.nav-item-text');

        $groupItems.each(function() {
            var $this = $(this),
                itemId = $this.attr('data-id'),
                activeItems = that.getActiveItems();

            if (activeItems) {
                for (var id in activeItems) {
                    var isActive = activeItems[id];
                    if (itemId === id && isActive) {
                        $this.parent().addClass('is_active');
                    }
                }
            }
        });

        $groupItems.on('click', function () {
            var $this = $(this),
                itemId = $this.attr('data-id'),
                isActive = $this.parent().hasClass('is_active');

            if (isActive) {
                $this.parent().removeClass('is_active');
                that.setItemActive(itemId, false);
            } else {
                $this.parent().addClass('is_active');
                that.setItemActive(itemId, true);
            }
        });

        $elem.find('a').each(function () {
            var $link = $(this);
            if (this.href === currentUrl) {
                $link.parent().addClass('is_active');
                $link.parent().parent().parent().addClass('is_active');
                $link.on('click', function (e) {
                    e.preventDefault()
                });
            }
        });
    };

    NavTree.prototype.getActiveItems = function() {
        var items = null;
        var navId = this.navId;
        var allItems = storage.getItem(NavTree.STORAGE_RECORD_NAME);

        if (allItems !== null && navId in allItems) {
            items = allItems[navId];
        }

        return items;
    };

    NavTree.prototype.setItemActive = function(item, isActive) {
        var items = storage.getItem(NavTree.STORAGE_RECORD_NAME);
        var navId = this.navId;

        if (items === null) {
            items = storage.setItem(NavTree.STORAGE_RECORD_NAME, {});
        }

        if (!(navId in items)) {
            items[navId] = {};
            storage.setItem(NavTree.STORAGE_RECORD_NAME, items);
        }

        items[navId][item] = isActive;

        storage.setItem(NavTree.STORAGE_RECORD_NAME, items);
    };

    return NavTree;
});