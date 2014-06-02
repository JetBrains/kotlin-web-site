define([
    'jquery',
    'util/render',
    'util/localStorage'
], function ($, render, localStorage) {

    var templates = {},
        helpers = {};

    function NavTree(elem, data) {
        var that = this;

        that.elem = elem;

        that.id = elem.getAttribute('id');

        console.log(data);

        var rendered = render(templates.itemsList(data));

        console.log(rendered);
    }

    NavTree.prototype.elem = null;

    NavTree.prototype.id = null;

    NavTree.prototype.defaults = {
        saveState: true
    };

    templates.main = function() {

    };

    templates.itemsList = function(items) {
        var t = ['.nav-tree-items-list'],
            item, itemTemplate;

        for (var i = 0, len = items.length; i < len; i++) {
            item = items[i];
            itemTemplate = templates.item(item);

            if ('content' in item && item.content && item.content.length > 0) {
                itemTemplate.push(templates.itemsList(item.content));
            }

            t.push(itemTemplate);
        }

        return [t];
    };

    templates.item = function(item) {
        var hasUrl = 'url' in item,
            hasTitle = 'title' in item,
            hasContent = 'content' in item,
            itemUrl = hasUrl ? item.url : null,
            itemTitle = hasTitle ? item.title : null,
            exandableClass = (hasContent ? '._expandable' : '');

        if (!hasTitle) {
            for (itemUrl in item) {
                itemTitle = item[itemUrl];
            }
            hasUrl = !!itemUrl;
        }

        var t =
            ['.nav-tree-item.js-item' + exandableClass, {'data-id': itemTitle},
                hasUrl
                    ? ['a.nav-tree-item-title-link.js-item-title-link', {href: itemUrl}, itemTitle]
                    : ['.nav-tree-item-title.js-item-title', itemTitle]
            ];

        return t;
    };

    return NavTree;
});