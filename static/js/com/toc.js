var $ = require('jquery');

function Toc(options) {
  var that = this,
    option;

  if (typeof options == 'object') {
    for (option in options) {
      if (option in that) {
        that[option] = options[option];
      }
    }
  }

  that.scope = document.body;
  that.init(options);
}

Toc.prototype = {
  selector: 'h1,h2,h3,h4,h5,h6',

  scope: null,

  from: 1,

  to: 6,

  map: null,

  createLinks: true,

  cssClasses: {
    tocList: 'toc',
    tocListItem: 'toc-item_level_#'
  },

  init: function (options) {
    var that = this;

    that.map = that.get();
  },

  __getMap: function (selector, scope) {
    var that = this;
    var sections = [], sectionNode, section;
    var i, len;
    var selector = (typeof selector != 'undefined') ? selector : that.selector;
    var scope = (typeof scope != 'undefined') ? scope : that.scope;
    var sectionsNodes = ('querySelectorAll' in scope)
      ? scope.querySelectorAll(selector)
      : $(selector, scope);

    for (i = 0, len = sectionsNodes.length; i < len; i++) {
      sectionNode = sectionsNodes[i];
      section = {
        id: sectionNode.id,
        level: parseInt(sectionNode.tagName.substr(1, 1)),
        title: $(sectionNode).text(),
        node: sectionNode,
        content: []
      };
      sections.push(section);
    }
    return sections;
  },

  get: function (options) {
    var that = this;
    var selector = (options && typeof options.selector != 'undefined') ? options.selector : that.selector;
    var scope = (options && typeof options.scope != 'undefined') ? options.scope : that.scope;
    var sectMap, tocList;

    sectMap = that.__getMap(selector, scope);
    if (sectMap.length == 0) {
      return [];
    }

    tocList = that.__getBranch(sectMap, sectMap[0].level, 0);
    return tocList;
  },

  render: function (opts) {
    var that = this;
    var from = (opts && typeof opts.from != 'undefined') ? opts.from : that.from;
    var to = (opts && typeof opts.to != 'undefined') ? opts.to : that.to;
    var target = (opts && typeof opts.target != 'undefined') ? opts.target : null;
    var toc;

    toc = that.__create(that.map, from, to);

    if (target != null) {
      target.appendChild(toc);
    }

    return toc;
  },

  __create: function (list, from, to) {
    var that = this;
    var createLinks = that.createLinks;
    var ul, li, a, title;
    var section, sectionContent;
    var css = that.cssClasses;
    var i, len;

    if (list.length == 0) {
      return null;
    }

    ul = document.createElement('ul');
    ul.className = css.tocList;
    for (i = 0, len = list.length; i < len; i++) {
      section = list[i];

      li = document.createElement('li');
      li.className = css.tocListItem.replace('#', section.level);

      if (createLinks) {
        title = document.createElement('a');
        title.href = "#" + section.id;
        title.appendChild(document.createTextNode(section.title));
      }
      else {
        title = document.createTextNode(section.title);
      }

      li.appendChild(title);

      if (section.content.length > 0 &&
        section.content[0].level >= from &&
        section.content[0].level <= to) {
        sectionContent = that.__create(section.content, from, to);
        li.appendChild(sectionContent);
      }

      ul.appendChild(li);
    }
    return ul;
  },

  __getBranch: function (sections, level, start, firstRun) {
    var that = this;
    var firstRun = (typeof firstRun !== 'undefined') ? firstRun : true;
    var end = sections.length;
    var tree = [];
    var section, prevSect;

    for (var i = start; i < end; i++) {
      section = sections[i];
      prevSect = (typeof sections[i - 1] !== 'undefined')
        ? sections[i - 1]
        : null;

      if (section.level == level) {
        // siblings
        tree.push(section);
      }
      else if (section.level > level) {
        // inner branch
        if (prevSect && prevSect.level < section.level) {
          prevSect.content = this.__getBranch(sections, section.level, i, false);
        }
      }
      else if (section.level < level) {
        // out of branch
        if (!firstRun) {
          break;
        }
      }
    }
    return tree;
  }
};

module.exports = Toc;