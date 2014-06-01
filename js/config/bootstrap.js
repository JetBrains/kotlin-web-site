require._config({
    baseUrl: '/js',

    paths: {
        'jquery': 'vendor/jquery/jquery-1.11.0.min',
        'jcarousel': 'vendor/jcarousel/jquery.jcarousel.min'
    },

    shim: {
        'jcarousel': {
            deps: ['jquery'],
            exports: 'jQuery.fn.jcarousel'
        }
    },

    deps: ['require'],

    callback: function (require) {
        require(['jquery']);

        // hack to activate :active support by Mobile Safari
        //document.addEventListener("touchstart", function () {}, false);
    }
});