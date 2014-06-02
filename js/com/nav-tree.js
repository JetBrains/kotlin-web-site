define([
    'jquery',
    'util/render',
    'util/localStorage'
], function ($, render, localStorage) {

    var templates = {},
        helpers = {};

    function NavTree(elem, config) {
        var that = this,
            fromExistingNodes;

        that.config = config = $.extend(that.defaults, config);

        that.elem = elem;

        that.id = elem.getAttribute('id');

        fromExistingNodes = 'data' in config === false;

        that.nodes = fromExistingNodes
            ? elem
            : render(templates.main(config.data));

        that._initEvents();

        if (config.saveState) {
            that.restoreItemsState();
        }

        if (!fromExistingNodes) {
            elem.appendChild(that.nodes);
        }
    }

    NavTree.STORAGE_KEY = 'nav_items';

    NavTree.prototype.elem = null;

    NavTree.prototype.nodes = null;

    NavTree.prototype.id = null;

    NavTree.prototype.config = {};

    NavTree.prototype.defaults = {
        saveState: true
    };

    NavTree.prototype._initEvents = function(n) {
        var that = this,
            nodes = that.nodes;

        $(nodes.querySelectorAll('.js-item-title')).on('click', function() {
            var $elem = $(this),
                $parent = $elem.parent(),
                itemId = $parent.attr('data-id'),
                isActive = $elem.hasClass('is_active');

            if (isActive) {
                $elem.removeClass('is_active');
                $parent.addClass('_collapsed');
            }
            else {
                $elem.addClass('is_active');
                $parent.removeClass('_collapsed');
            }

            if (itemId) {
                var states = that.getItemsStateInfo();
                states = states === null ? {} : states;
                states[itemId] = !isActive;
                that.setItemsStateInfo(states);
            }
        });
    };

    NavTree.prototype.getItemsStateInfo = function() {
        var storageKey = NavTree.STORAGE_KEY + '_' + this.id;
        var stateInfo = localStorage.getItem(storageKey);
        return stateInfo;
    };

    NavTree.prototype.setItemsStateInfo = function(info) {
        var storageKey = NavTree.STORAGE_KEY + '_' + this.id;
        localStorage.setItem(storageKey, info);
    };

    NavTree.prototype.restoreItemsState = function() {
        var that = this,
            states = that.getItemsStateInfo();

        if (states) {
            $(that.nodes.querySelectorAll('.js-item-title')).each(function() {
                var $elem = $(this),
                    $parent = $elem.parent(),
                    itemId = $parent.attr('data-id');

                if (itemId in states && states[itemId] === true) {
                    $elem.addClass('is_active');
                    $parent.removeClass('_collapsed');
                }
            });
        }
    };

    templates.main = function(items) {
        return [
            ['.nav-tree', templates.itemsList(items)],
            ['br'], ['br'], ['br']
        ];
    };

    templates.itemsList = function(items, parentId) {
        var t = ['.nav-tree-items-list'],
            item, itemTemplate,
            hasContent,
            parentId = parentId || null;

        for (var i = 0, len = items.length; i < len; i++) {
            item = items[i];
            hasContent = 'content' in item && item.content && item.content.length > 0;

            itemTemplate = templates.item(item, parentId);

            if (hasContent) {
                itemTemplate.push(
                    templates.itemsList(item.content, item.title)
                );
            }

            t.push(itemTemplate);
        }

        return [t];
    };

    templates.item = function(item, parentId) {
        var hasUrl = 'url' in item,
            hasTitle = 'title' in item,
            hasContent = 'content' in item && item.content !== null && item.content.length > 0,
            itemId,
            itemUrl = hasUrl ? item.url : null,
            itemTitle = hasTitle ? item.title : null,
            extraClass = (hasContent ? '._container-node._collapsed' : '._final-node');

        if (!hasTitle) {
            for (itemUrl in item) {
                itemTitle = item[itemUrl];
            }
            hasUrl = !!itemUrl;
        }

        itemId = (parentId !== null) ? parentId + '.' + itemTitle : itemTitle;

        var t =
            ['.nav-tree-item.js-item' + extraClass, {'data-id': itemId},
                hasUrl
                    ? ['a.nav-tree-item-title.js-item-title', {href: itemUrl}, itemTitle]
                    : ['.nav-tree-item-title.js-item-title', itemTitle]
            ];

        return t;
    };

    return NavTree;
});