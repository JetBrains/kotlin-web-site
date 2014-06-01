define(function() {
    var storage = {
        setItem: function (key, originValue) {
            var value = originValue,
                type = typeof originValue;

            if (type !== 'string' || type !== 'number' || type !== 'boolean' || type === null) {
                value = JSON.stringify(originValue);
            }

            localStorage.setItem(key, value);

            return originValue;
        },

        getItem: function (key) {
            var value = localStorage.getItem(key),
                valueLength,
                isNeedToParse;

            if (value !== null) {
                valueLength = value.length;
                isNeedToParse =
                    (value.substring(0, 1) === '[' && value.substring(valueLength-1, valueLength) === ']') ||
                    (value.substring(0, 1) === '{' && value.substring(valueLength-1, valueLength) === '}');

                if (isNeedToParse) {
                    value = JSON.parse(value);
                }
            }

            return value;
        },

        removeItem: function (key) {
            localStorage.removeItem(key);
        }
    };

    return storage;
});