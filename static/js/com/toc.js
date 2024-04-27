class Toc {
  constructor(options = {}) {
    this.selector = options.selector || 'h1,h2,h3,h4,h5,h6';
    this.scope = options.scope || document.body;
    this.from = options.from || 1;
    this.to = options.to || 6;
    this.createLinks = options.createLinks !== undefined ? options.createLinks : true;
    this.cssClasses = {
      tocList: 'toc',
      tocListItem: 'toc-item_level_#'
    };
    this.map = this.get();
  }

  getMap(selector, scope) {
    const sections = [];
    const sectionsNodes = scope.querySelectorAll(selector);
    for (const sectionNode of sectionsNodes) {
      const section = {
        id: sectionNode.id,
        level: parseInt(sectionNode.tagName.substr(1, 1)),
        title: sectionNode.textContent,
        node: sectionNode,
        content: []
      };
      sections.push(section);
    }
    return sections;
  }

  get(options) {
    const selector = options?.selector || this.selector;
    const scope = options?.scope || this.scope;
    const sectMap = this.getMap(selector, scope);
    if (sectMap.length === 0) return [];
    return this.getBranch(sectMap, sectMap[0].level, 0);
  }

  render(opts = {}) {
    const from = opts.from !== undefined ? opts.from : this.from;
    const to = opts.to !== undefined ? opts.to : this.to;
    const target = opts.target;
    const toc = this.create(this.map, from, to);
    if (target) target.appendChild(toc);
    return toc;
  }

  create(list, from, to) {
    const ul = document.createElement('ul');
    ul.className = this.cssClasses.tocList;
    for (const section of list) {
      const li = document.createElement('li');
      li.className = this.cssClasses.tocListItem.replace('#', section.level);
      const title = this.createLinks ? document.createElement('a') : document.createElement('span');
      if (this.createLinks) {
        title.href = `#${section.id}`;
        title.textContent = section.title;
      } else {
        title.textContent = section.title;
      }
      li.appendChild(title);
      if (section.content.length > 0 && section.content[0].level >= from && section.content[0].level <= to) {
        const sectionContent = this.create(section.content, from, to);
        li.appendChild(sectionContent);
      }
      ul.appendChild(li);
    }
    return ul;
  }

  getBranch(sections, level, start, firstRun = true) {
    const end = sections.length;
    const tree = [];
    for (let i = start; i < end; i++) {
      const section = sections[i];
      const prevSect = sections[i - 1] !== undefined ? sections[i - 1] : null;
      if (section.level === level) {
        tree.push(section);
      } else if (section.level > level) {
        if (prevSect && prevSect.level < section.level) {
          prevSect.content = this.getBranch(sections, section.level, i, false);
        }
      } else if (section.level < level) {
        if (!firstRun) break;
      }
    }
    return tree;
  }
}

export default Toc;
