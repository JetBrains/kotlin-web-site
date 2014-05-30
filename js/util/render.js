define(function() {
    var util = {
        isObject: function (object) {
            return Object.prototype.toString.call(object) === '[object Object]';
        },

        isArray: function (object) {
            return Object.prototype.toString.call(object) === '[object Array]';
        },

        selectorPatterns: [
            {
                name: 'class',
                regex: new RegExp('\\.([a-zA-Z0-9-_])*')
            },
            {
                name: 'id',
                regex: new RegExp('#([a-zA-Z0-9-_])*')
            }
        ],

        parseSelector: function (selector) {
            var patterns = util.selectorPatterns,
                props = {},
                value = '';

            for (var i = 0, len = patterns.length; i < len; i++) {
                var pattern = patterns[i];
                var regex = pattern.regex;

                while (regex.test(selector)) {
                    var matches = regex.exec(selector);
                    selector = selector.replace(matches[0], '');
                    value = matches[0].substring(1);

                    if (pattern.name in props) {
                        props[pattern.name] += ' ' + value;
                    } else {
                        props[pattern.name] = value;
                    }
                }
            }

            if (selector !== '') {
                props['tag'] = selector;
            } else {
                props['tag'] = 'div';
            }

            return props;
        }
    };

    /**
     * @param {Array} data
     * @param {HTMLElement} target [optional]
     * @returns {DocumentFragment}
     */
    function render(data, target) {
        var context = target || document.createDocumentFragment(),
            dataLength = data.length,
            i,
            item, elem, props, attrName,
            isNull;

        for (i = 0; i < dataLength; i++) {
            item = data[i];
            isNull = item === null || item === undefined || item === false;

            if (isNull) {
                continue;
            }

            // text node
            if (typeof item === 'string' || typeof item === 'number') {
                context.appendChild(document.createTextNode(item));
                continue;
            }

            // _elem
            if (typeof item[0] === 'string') {
                props = util.parseSelector(item[0]);
                elem = document.createElement(props.tag);

                item.shift();
                delete props.tag;

                if (util.isObject(item[0])) {
                    for (attrName in item[0]) {
                        props[attrName] = item[0][attrName];
                    }
                }

                for (attrName in props) {
                    elem.setAttribute(attrName, props[attrName]);
                    delete props[attrName];
                }

                context.appendChild(render(item, elem));

                continue;
            }

            // node
            if (item.nodeType !== undefined) {
                context.appendChild(item);
                continue;
            }

            render(item, context);
        }

        return context;
    }

    return render;
});
