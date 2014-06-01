define(function () {
    var cookieUtils = {

        isCookiesEnabled: function () {
            return navigator.cookieEnabled;
        },

        /**
         * @param name
         * @returns {string|null}
         */
        getCookie: function (name) {
            var regexp = new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)');
            var matches = document.cookie.match(regexp);
            return matches ? decodeURIComponent(matches[1]) : null;
        },

        /**
         * @param {string} name
         * @returns {boolean}
         */
        hasCookie: function (name) {
            var cookie = this.getCookie(name);
            return cookie !== null;
        },

        /**
         * @param {string} name
         * @param {string} value
         * @param {object} options
         *                 options.expires (number (in seconds), Date, null)
         *                 options.path (string)
         *                 options.domain (string)
         *                 options.secure (boolean)
         * @returns void
         */
        setCookie: function (name, value, options) {
            options = options || {};

            var expires = options.expires;

            if (typeof expires === 'number' && expires) {
                var d = new Date();
                d.setTime(d.getTime() + expires * 1000);
                expires = options.expires = d;
            }
            if (expires && expires.toUTCString) {
                options.expires = expires.toUTCString();
            }

            value = encodeURIComponent(value);

            var updatedCookie = name + '=' + value;

            for (var propName in options) {
                updatedCookie += '; ' + propName;
                var propValue = options[propName];
                if (propValue !== true) {
                    updatedCookie += "=" + propValue;
                }
            }

            document.cookie = updatedCookie;
        },

        /**
         * @param {string} name
         * @returns void
         */
        removeCookie: function (name) {
            this.setCookie(name, '', {expires: -1});
        }
    };

    return cookieUtils;
});