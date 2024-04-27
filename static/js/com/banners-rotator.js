class Banner {
  constructor(params) {
    this.validateParams(params);
    this.assignParams(params);

    this.mountNode = this.resolveMountNode(params.mountNode);
    this.nodes = null;
  }

  static TYPE = {
    slideup: 'slideup',
    inplace: 'inplace'
  };

  static defaults = {
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

  static getCookieNameFor(id) {
    return 'banner_' + id;
  }

  validateParams(params) {
    if (!params.id || !params.type) {
      throw new Error('Banner `id` and `type` must be provided');
    }

    if (!(params.type in Banner.TYPE)) {
      throw new Error('Unsupported banner type `' + params.type + '`');
    }
  }

  assignParams(params) {
    const defaults = Banner.defaults[params.type];
    this.id = params.id;
    this.type = params.type;
    this.url = params.url || null;
    this.imageUrl = params.imageUrl || null;
    this.width = params.width || defaults.width;
    this.height = params.height || defaults.height;
    this.template = params.template || null;
    this.target = params.target || '_self';
    this.linkCss = params.linkCss || null;
    this.closeButtonCss = params.closeButtonCss || null;
    this.onCreate = typeof params.onCreate === 'function' ? params.onCreate : null;
    this.onClick = typeof params.onClick === 'function' ? params.onClick : null;
  }

  resolveMountNode(mountNode) {
    const defaultMountNode = Banner.defaults[this.type].mountNode;
    const resolvedMountNode = mountNode ? (typeof mountNode === 'string' ? document.getElementById(mountNode) : mountNode) : defaultMountNode;

    if (!resolvedMountNode) {
      throw new Error('Mount node for `' + this.id + '` does not exist');
    }

    return resolvedMountNode;
  }

  _createNodes() {
    const nodesClasses = {
      container: ['jb-promotion', 'jb-' + this.type + '-promotion', 'id_' + this.id, this.type === Banner.TYPE.slideup ? 'is_hidden' : ''],
      body: ['jb-promotion__body', 'jb-' + this.type + '-promotion__body'],
      closeButton: ['jb-promotion__close-button', 'jb-' + this.type + '-promotion__close-button'],
      link: ['jb-promotion__link', 'jb-' + this.type + '-promotion__link']
    };

    const nodes = {
      container: $('<div class="' + nodesClasses.container.join(' ') + '"></div>'),
      body: $('<div class="' + nodesClasses.body.join(' ') + '"></div>'),
      link: this.url ? $('<a href="' + this.url + '" class="' + nodesClasses.link.join(' ') + '" target="' + this.target + '"></a>') : '',
      closeButton: $('<div class="' + nodesClasses.closeButton.join(' ') + '" title="Close"></div>')
    };

    nodes.body.css({
      width: this.width,
      height: this.height,
      backgroundImage: this.imageUrl ? 'url("' + this.imageUrl + '")' : 'none'
    });

    if (this.url && this.linkCss) nodes.link.css(this.linkCss);
    if (this.closeButtonCss) nodes.closeButton.css(this.closeButtonCss);
    if (this.template) nodes.body.html(this.template);

    return nodes;
  }

  render() {
    this.nodes = this._createNodes();
    this.nodes.body
      .append(this.nodes.link)
      .append(this.nodes.closeButton);

    this.nodes.container
      .append(this.nodes.body)
      .appendTo(this.mountNode);

    this.nodes.closeButton.on('click', this.closeHandler.bind(this));
    if (this.url) {
      this.nodes.link.on('click', () => {
        if (this.onClick) this.onClick();
        this.closeHandler();
      });
    }

    if (this.type === Banner.TYPE.slideup) {
      setTimeout(() => this.show(), 300);
    }

    if (this.onCreate) this.onCreate();
  }

  closeHandler() {
    const cookieName = Banner.getCookieNameFor(this.id);
    this.setCookie(cookieName, '0', 365, '/');
    this.hide();
  }

  show() {
    this.nodes.container.removeClass('is_hidden');
  }

  hide() {
    this.nodes.container.addClass('is_hidden');
  }

  setCookie(name, value, lifespan, access_path) {
    let cookietext = name + "=" + escape(value);
    if (lifespan != null) {
      const today = new Date();
      const expiredate = new Date(today.getTime() + 1000 * 60 * 60 * 24 * lifespan);
      cookietext += "; expires=" + expiredate.toGMTString();
    }
    if (access_path != null) {
      cookietext += "; PATH=" + access_path;
    }
    document.cookie = cookietext;
  }

}

class BannersRotator {
  constructor() {
    this.instances = [];
  }

  createBanner(params) {
    if (this.isBannerShouldBeShown(params.id)) {
      try {
        const banner = new Banner(params);
        banner.render();
        this.instances.push(banner);
      } catch (e) {
        console.error(e);
      }
    }
  }

  isBannerShouldBeShown(id) {
    const cookieName = Banner.getCookieNameFor(id);
    const cookieValue = this.getCookie(cookieName);
    return cookieValue === null || cookieValue !== '0';
  }

  getCookie(Name) {
    const search = Name + "=";
    const CookieString = document.cookie;
    let result = null;
    if (CookieString.length > 0) {
      let offset = CookieString.indexOf(search);
      if (offset != -1) {
        offset += search.length;
        let end = CookieString.indexOf(";", offset);
        if (end == -1) {
          end = CookieString.length;
        }
        result = unescape(CookieString.substring(offset, end));
      }
    }
    return result;
  }
}

window.bannersRotator = new BannersRotator();
window.bannersRotator.Banner = Banner;

export default window.bannersRotator;
