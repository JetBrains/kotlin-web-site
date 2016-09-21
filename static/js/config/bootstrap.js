require._config({
    baseUrl: '/js',

    paths: {
        'jquery': 'vendor/jquery/jquery-1.12.4.min',
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
        var html = document.getElementsByTagName('html')[0];

        html.className = html.className.replace('no-js', '');

        // OS detection
        if (navigator.userAgent.indexOf('Linux') > -1)
            html.className += ' os_linux';
        
        // Browser detection
        if ('chrome' in window)
            html.className += ' ua_chrome';
        else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
            html.className += ' ua_firefox';

        // hack to force :active support in mobile Safari
        document.addEventListener("touchstart", function () {}, false);

        // OS and browser detection
        require(['jquery']);
    }
});