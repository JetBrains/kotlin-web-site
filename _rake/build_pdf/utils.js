var utils = {
    $: function(selector) {
        return document.querySelector(selector);
    },

    /**
     * [page]       Replaced by the number of the pages currently being printed
     * [frompage]   Replaced by the number of the first page to be printed
     * [topage]     Replaced by the number of the last page to be printed
     * [webpage]    Replaced by the URL of the page being printed
     * [section]    Replaced by the name of the current section
     * [subsection] Replaced by the name of the current subsection
     * [date]       Replaced by the current date in system local format
     * [time]       Replaced by the current time in system local format
     * [title]      Replaced by the title of the of the current page object
     * [doctitle]   Replaced by the title of the output document
     */
    getParams: function () {
        var params = {},
            paramPair,
            rawParamsPairs = document.location.search.substring(1).split('&');

        if (rawParamsPairs.length > 0 && rawParamsPairs[0] !== '') {
            for (var i = 0, len = rawParamsPairs.length; i < len; i++) {
                paramPair = rawParamsPairs[i].split('=');
                params[paramPair[0]] = decodeURIComponent(paramPair[1]);
            }
        }

        return params;
    }
};