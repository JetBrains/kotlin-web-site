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
            : that.render(config.data);

        that._initEvents();

        if (config.saveState) {
            that.restoreItemsState();
        }

        if (!fromExistingNodes) {
            elem.appendChild(that.nodes);
            that.nodes = elem;
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

    NavTree.prototype._events = {};

    NavTree.prototype.render = function(data) {
        var templates = this.templates;
        return render(templates.main(data));
    };

    NavTree.prototype.on = function(eventName, callback) {
        this._events[eventName] = callback;
    };

    NavTree.prototype.fireEvent = function (eventName) {
        var args;

        if (eventName in this._events) {
            args = Array.prototype.slice.call(arguments, 1);

            return this._events[eventName].apply(this, args);
        }
    };

    NavTree.prototype._initEvents = function() {
        var that = this,
            nodes = that.nodes;

        $(nodes.querySelectorAll('.js-item-title')).on('click', function(e) {
            var $elem = $(this),
                branchElem = this.parentNode,
                $branch = $(branchElem),
                itemId = $branch.attr('data-id'),
                isActive = $elem.hasClass('is_active'),
                isLeaf = $branch.hasClass('js-leaf'),
                isLeafWereSelected;

            if (isLeaf) {
                that._selectLeaf(this, e);
                return;
            }

            if (isActive) {
                that._closeBranch(this, e);
            }
            else {
                that._openBranch(this, e);
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

                if (itemId in states) {
                    if (states[itemId] === true)
                        that._openBranch(this);
                    else
                        that._closeBranch(this);
                }
            });
        }
    };

    NavTree.prototype._openBranch = function(branchTitleElem, e) {
        var that = this,
            $elem = $(branchTitleElem),
            $parent = $elem.parent();

        $elem.addClass('is_active');
        $parent.addClass('_opened');
        $parent.removeClass('_closed');

        that.fireEvent('openBranch', e, branchTitleElem.parentNode, branchTitleElem);
    };

    NavTree.prototype._closeBranch = function(branchTitleElem, e) {
        var that = this,
            $elem = $(branchTitleElem),
            $parent = $elem.parent();

        $elem.removeClass('is_active');
        $parent.addClass('_closed');
        $parent.removeClass('_opened');

        that.fireEvent('closeBranch', e, branchTitleElem.parentNode, branchTitleElem);
    };

    NavTree.prototype._selectLeaf = function(leafElem, e, branchElem) {
        var that = this,
            nodes = that.nodes;

        $(nodes).find('.js-leaf-title').each(function(i, elem) {
            var $elem = $(elem),
                isActive = $elem.hasClass('is_active');

            if (elem === leafElem) {
                if (!isActive) {
                    that.fireEvent('selectLeaf', e, branchElem, elem);
                    $elem.addClass('is_active');
                }
            } else {
                $elem.removeClass('is_active');
            }
        });

        return true;
    };

    NavTree.prototype.templates = {};

    NavTree.prototype.templates.main = function(items) {
        var templates = this;
        return [
            ['.nav-tree', templates.itemsList(items)]
        ];
    };

    NavTree.prototype.templates.itemsList = function(items, parentId) {
        var t = [],
            templates = this,
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

    NavTree.prototype.templates.item = function(item, parentId) {
        var templates = this,
            hasUrl = 'url' in item,
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

        item.id = itemId;
        item.title = itemTitle;
        item.url = itemUrl;

        var t = isBranch
                ? templates.branchItem(item)
                : templates.leafItem(item)
        return t;
    };

    NavTree.prototype.templates.branchItem = function(item) {
        var t =
            ['.tree-item.tree-branch.js-item.js-branch._closed', {'data-id': item.id},
                ['.tree-item-title.tree-branch-title.js-item-title.js-branch-title',
                    ['span.marker'],
                    ['span.text', item.title]
                ]
            ];

        return t;
    };

    NavTree.prototype.templates.leafItem = function(item) {
        var hasUrl = 'url' in item;
        var t =
            ['.tree-item.tree-leaf.js-item.js-leaf',
                [(hasUrl ? 'a' : 'div') + '.tree-item-title.tree-leaf-title.js-item-title.js-leaf-title', hasUrl ? {href: item.url} : null,
                    ['span.marker'],
                    ['span.text', item.title]
                ]
            ];

        return t;
    };

    return NavTree;
});