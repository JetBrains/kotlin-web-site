define([
    'jquery'
], function($){
    /**
     * @constructor
     * @param params
     * @param {Object} params
     * @param {String} params.id
     * @param {Banner.TYPE} params.type
     * @param {HTMLElement|jQuery|String} [params.mountNode] Banner will render at this node
     * @param {String} [params.url]
     * @param {String} [params.imageUrl]
     * @param {Number} [params.width]
     * @param {Number} [params.height]
     * @param {String} [params.template]
     * @param {String} [params.target] `_self` or `_blank`
     * @param {Object} [params.linkCss] CSS props hash for jQuery.css
     * @param {Object} [params.closeButtonCss] CSS props hash for jQuery.css
     * @param {Function} [params.onCreate] Called when banner is created
     * @param {Function} [params.onClick] Called when user clicks on banner
     */
    function Banner(params) {
        if (!params.id || !params.type)
            throw new Error('Banner `id` and `type` sould be provided');

        if (!(params.type in Banner.TYPE))
            throw new Error('Unsupported banner type `'+ params.type +'`');

        var mountNode = ('mountNode' in params) ? params.mountNode : Banner.defaults[params.type].mountNode;
        if (!mountNode) throw new Error('You must provide mount node for `' + params.id + '` banner');
        mountNode = (typeof mountNode === 'string') ? document.getElementById(mountNode) : mountNode;
        if (!mountNode) throw new Error('Mount node for `' + params.id + '` doesnt exist');
        this.mountNode = mountNode;

        this.id = params.id;
        this.type = params.type;
        this.url = 'url' in params ? params.url : null;
        this.imageUrl = 'imageUrl' in params ? params.imageUrl : null;
        this.width = 'width' in params ? params.width : Banner.defaults[params.type].width;
        this.height = 'height' in params ? params.height : Banner.defaults[params.type].height;
        this.template = 'template' in params ? params.template : null;
        this.target = 'target' in params ? params.target : '_self';
        this.linkCss = 'linkCss' in params ? params.linkCss : null;
        this.closeButtonCss = 'closeButtonCss' in params ? params.closeButtonCss : null;

        this.onCreate = ('onCreate' in params && typeof params.onCreate === 'function') ? params.onCreate : null;
        this.onClick = ('onClick' in params && typeof params.onClick === 'function') ? params.onClick : null;
    }

    /**
     * @const
     */
    Banner.TYPE = {
        slideup: 'slideup',
        inplace: 'inplace'
    };

    /**
     * @const
     */
    Banner.defaults = {
        slideup: {
            width: 622,
            height: 90,
            mountNode: $('body')
        },
        inplace: {
            width: 'auto',
            height: 'auto',
            mountNode: null
        }
    };

    /**
     * @static
     */
    Banner.getCookieNameFor = function (id) {
        return 'banner_' + id;
    };

    /**
     * @type {Array<jQuery>}
     */
    Banner.prototype.nodes = null;

    /**
     * @return {Array<jQuery>}
     */
    Banner.prototype._createNodes = function () {
        var banner = this,
            nodes;

        var nodesClasses = {
            container: [
                'jb-promotion',
                'jb-' + banner.type + '-promotion',
                'id_' + banner.id,
                banner.type === Banner.TYPE.slideup ? 'is_hidden' : ''
            ],
            body: [
                'jb-promotion__body',
                'jb-' + banner.type + '-promotion__body'
            ],
            closeButton: [
                'jb-promotion__close-button',
                'jb-' + banner.type + '-promotion__close-button'
            ],
            link: [
                'jb-promotion__link',
                'jb-' + banner.type + '-promotion__link'
            ]
        };

        nodes = {
            container: $('<div class="' + nodesClasses.container.join(' ') + '"></div>'),
            body: $('<div class="' + nodesClasses.body.join(' ') + '"></div>'),
            link: banner.url ? $('<a href="' + banner.url + '" class="' + nodesClasses.link.join(' ') + '" target="' + banner.target + '"></a>') : '',
            closeButton: $('<div class="' + nodesClasses.closeButton.join(' ') + '" title="Close"></div>')
        };

        nodes.body.css({
            width: banner.width,
            height: banner.height,
            backgroundImage: banner.imageUrl ? 'url("'+ banner.imageUrl +'")' : 'none'
        });

        if (banner.url && banner.linkCss) nodes.link.css(banner.linkCss);
        if (banner.closeButtonCss) nodes.closeButton.css(banner.closeButtonCss);
        if (banner.template) nodes.body.html(banner.template);

        return nodes;
    };

    Banner.prototype.render = function () {
        var banner = this,
            mountNode = this.mountNode,
            nodes;

        nodes = this.nodes = this._createNodes();

        nodes.body
            .append(nodes.link)
            .append(nodes.closeButton);

        nodes.container
            .append(nodes.body)
            .appendTo(mountNode);

        nodes.closeButton.on('click', banner.closeHandler.bind(banner));
        if (banner.url) {
            nodes.link.on('click', function () {
                if (banner.onClick) banner.onClick.call(banner);
                banner.closeHandler.call(banner);
            });
        }

        if (banner.type === Banner.TYPE.slideup)
            setTimeout(banner.show.bind(banner), 300);

        if (banner.onCreate) banner.onCreate.call(banner);
    };

    Banner.prototype.closeHandler = function () {
        var cookieName = this.getCookieName();
        setCookie(cookieName, '0', 365, '/');
        this.hide();
    };

    Banner.prototype.show = function () {
        this.nodes.container.removeClass('is_hidden');
    };

    Banner.prototype.hide = function () {
        this.nodes.container.addClass('is_hidden');
    };

    Banner.prototype.getCookieName = function () {
        return Banner.getCookieNameFor(this.id);
    };

    Banner.prototype.destroy = function () {
        var banner = this,
            nodes = this.nodes;

        nodes.closeButton.off('click', banner.closeHandler);
        if (banner.url && banner.onClick) nodes.link.off('click', banner.onClick);
        nodes.container.remove();
    };

    function setCookie(name, value, lifespan, access_path) {
        var cookietext = name + "=" + escape(value);
        if (lifespan != null) {
            var today = new Date();
            var expiredate = new Date();
            expiredate.setTime(today.getTime() + 1000 * 60 * 60 * 24 * lifespan);
            cookietext += "; expires=" + expiredate.toGMTString();
        }
        if (access_path != null) {
            cookietext += "; PATH=" + access_path;
        }
        document.cookie = cookietext;
        return null;
    }


    function getCookie(Name) {
        var search = Name + "=";
        var CookieString = document.cookie;
        var result = null;
        if (CookieString.length > 0) {
            offset = CookieString.indexOf(search);
            if (offset != -1) {
                offset += search.length;
                end = CookieString.indexOf(";", offset);
                if (end == -1) {
                    end = CookieString.length;
                }
                result = unescape(CookieString.substring(offset, end));
            }
        }
        return result;
    }


    var bannersRotator = {};

    bannersRotator.instances = [];

    bannersRotator.createBanner = function (params) {
        if (this.isBannerShouldBeShown(params.id)) {
            try {
                var banner = new Banner(params);
                banner.render();
                this.instances.push(banner);
            } catch (e) {
            }
        }
    };

    bannersRotator.isBannerShouldBeShown = function (id) {
        var cookieName = Banner.getCookieNameFor(id);
        var cookieValue = getCookie(cookieName);
        return cookieValue === null || cookieValue !== '0';
    };


    window.bannersRotator = bannersRotator;
    window.bannersRotator.Banner = Banner;

    return bannersRotator
});