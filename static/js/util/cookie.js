const cookieUtils = {
  isCookiesEnabled: () => navigator.cookieEnabled,

  getCookie: name => {
    const regexp = new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)');
    const matches = document.cookie.match(regexp);
    return matches ? decodeURIComponent(matches[1]) : null;
  },

  hasCookie: name => cookieUtils.getCookie(name) !== null,

  setCookie: (name, value, options = {}) => {
    let expires = options.expires;

    if (typeof expires === 'number' && expires) {
      expires = new Date(Date.now() + expires * 1000);
    }

    if (expires instanceof Date) {
      options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    let updatedCookie = name + '=' + value;

    for (const propName in options) {
      if (options.hasOwnProperty(propName)) {
        updatedCookie += '; ' + propName;
        const propValue = options[propName];
        if (propValue !== true) {
          updatedCookie += "=" + propValue;
        }
      }
    }

    document.cookie = updatedCookie;
  },

  removeCookie: name => cookieUtils.setCookie(name, '', { expires: -1 })
};

export default cookieUtils;
