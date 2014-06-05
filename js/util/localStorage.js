define({
    /**
     * @param {string} key
     * @param {*} value
     * @returns {*}
     */
    setItem: function (key, value) {
        var type = typeof value;

        if (type !== 'string' || type !== 'number' || type !== 'boolean' || type === null) {
            value = JSON.stringify(value);
        }

        localStorage.setItem(key, value);

        return arguments[1];
    },

    /**
     * @param {string} key
     * @returns {*}
     */
    getItem: function (key) {
        var value = localStorage.getItem(key),
            valueLength,
            isNeedToParse;

        if (value !== null) {
            valueLength = value.length;
            isNeedToParse =
                (value.substring(0, 1) === '[' && value.substring(valueLength - 1, valueLength) === ']') ||
                    (value.substring(0, 1) === '{' && value.substring(valueLength - 1, valueLength) === '}');

            if (isNeedToParse) {
                value = JSON.parse(value);
            }
        }

        return value;
    },

    /**
     * @param {string} key
     */
    removeItem: function (key) {
        localStorage.removeItem(key);
    },

    /**
     * @returns {object|null}
     */
    getAllItems: function () {
        var key,
            items = {},
            i = 0;

        for (key in localStorage) {
            items[key] = localStorage[key];
            i++;
        }

        return i > 0 ? items : null;
    },

    /**
     * @returns void
     */
    clear: function () {
        localStorage.clear();
    }
});