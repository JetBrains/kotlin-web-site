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

    NavTree.prototype._initEvents = function() {
        var that = this,
            nodes = that.nodes;

        $(nodes.querySelectorAll('.js-item-title')).on('click', function() {
            var $elem = $(this),
                $parent = $elem.parent(),
                itemId = $parent.attr('data-id'),
                isActive = $elem.hasClass('is_active'),
                isLeaf = $parent.hasClass('js-leaf');

            if (isLeaf) {
                return
            }

            if (isActive)
                that._closeBranch(this);
            else
                that._openBranch(this);

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

                if (itemId in states) {
                    if (states[itemId] === true)
                        that._openBranch(this);
                    else
                        that._closeBranch(this);
                }
            });
        }
    };

    NavTree.prototype._openBranch = function(branchTitleNode) {
        var $elem = $(branchTitleNode),
            $parent = $elem.parent();

        $parent.addClass('_opened');
        $parent.removeClass('_closed');
        $elem.addClass('is_active');
    };

    NavTree.prototype._closeBranch = function(branchTitleElem) {
        var $elem = $(branchTitleElem),
            $parent = $elem.parent();

        $parent.addClass('_closed');
        $parent.removeClass('_opened');
        $elem.removeClass('is_active');
    };

    templates.main = function(items) {
        return [
            ['.nav-tree', templates.itemsList(items)]
        ];
    };

    templates.itemsList = function(items, parentId) {
        var t = [],
            item, itemTemplate,
            hasContent,
            parentId = parentId || null;

        for (var i = 0, len = items.length; i < len; i++) {
            item = items[i];
            hasContent = 'content' in item && item.content && item.content.length > 0;

            itemTemplate = templates.item(item, parentId);

            if (hasContent) {
                itemTemplate.push(
                    templates.itemsList(item.content, parentId === null ? item.title : parentId)
                );
            }

            t.push(itemTemplate);
        }

        return t;
    };

    templates.item = function(item, parentId) {
        var hasUrl = 'url' in item,
            hasTitle = 'title' in item,
            hasContent = 'content' in item && item.content !== null && item.content.length > 0,
            isBranch = hasContent,
            isLeaf = !isBranch,
            type = isBranch ? 'branch' : 'leaf',
            itemId,
            itemUrl = hasUrl ? item.url : null,
            itemTitle = hasTitle ? item.title : null;

        if (!hasTitle) {
            for (itemUrl in item) {
                itemTitle = item[itemUrl];
            }
            hasUrl = !!itemUrl;
        }

        itemId = (parentId !== null) ? parentId + '.' + itemTitle : itemTitle;

        var t =
            isBranch
                ? ['.tree-item.tree-branch.js-item.js-branch._closed', {'data-id': itemId}]
                : ['.tree-item.tree-leaf.js-item.js-leaf']
            ;

        t.push(
            [(hasUrl ? 'a' : 'div') + '.tree-item-title.tree-' + type + '-title.js-item-title.js-' + type + '-title',
                hasUrl ? {href: itemUrl} : null,
                ['span.marker'],
                ['span.text', itemTitle]
            ]
        );

        return t;
    };

    return NavTree;
});