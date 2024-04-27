const util = {
  isObject: object => Object.prototype.toString.call(object) === '[object Object]',
  isArray: object => Object.prototype.toString.call(object) === '[object Array]',
  selectorPatterns: [
    { name: 'class', regex: /\.([a-zA-Z0-9-_])*/ },
    { name: 'id', regex: /#([a-zA-Z0-9-_])*/ }
  ],
  parseSelector: selector => {
    const patterns = util.selectorPatterns;
    const props = {};

    patterns.forEach(pattern => {
      const regex = pattern.regex;
      while (regex.test(selector)) {
        const matches = regex.exec(selector);
        selector = selector.replace(matches[0], '');
        const value = matches[0].substring(1);

        props[pattern.name] = props[pattern.name] ? `${props[pattern.name]} ${value}` : value;
      }
    });

    if (selector) {
      props.tag = selector;
    } else {
      props.tag = 'div';
    }

    return props;
  }
};

function render(data, target) {
  const context = target || document.createDocumentFragment();

  data.forEach(item => {
    if (item == null || item === undefined || item === false) return;

    if (typeof item === 'string' || typeof item === 'number') {
      context.appendChild(document.createTextNode(item));
    } else if (Array.isArray(item) && typeof item[0] === 'string') {
      const props = util.parseSelector(item[0]);
      const elem = document.createElement(props.tag);

      item.shift();
      delete props.tag;

      if (util.isObject(item[0])) {
        Object.assign(props, item[0]);
      }

      Object.entries(props).forEach(([attrName, value]) => {
        elem.setAttribute(attrName, value);
      });

      context.appendChild(render(item, elem));
    } else if (item.nodeType !== undefined) {
      context.appendChild(item);
    } else {
      render(item, context);
    }
  });

  return context;
}

export default render;
