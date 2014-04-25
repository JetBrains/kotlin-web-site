if (typeof ui === 'undefined') {
    var ui = {};
}

ui.nav = {
    init: function(nav, selector) {
        if (nav in this._navs) {
            this._navs[nav](selector);
        }
    },

    _navs: {
        tree: function(selector) {
            var $navItems = $(selector).find('.nav-item-text');

            $navItems.on('click', function() {
                $(this).parent().toggleClass('is_active');
            });
        }
    }
};