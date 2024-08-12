module.exports = class RedirectCollector {
    constructor() {
        this.matched = new Map();
        this.redirects = new Map();
        this.unmatched = new Set();
    }

    add(from, to) {
        if (this.matched.has(from)) throw Error(`Double match ${from}: ${this.matched.get(from)} <-> ${to}`);

        this.matched.set(from, to);
    }

    addUnmatched(path) {
        this.unmatched.add(path);
    }

    addRedirect(oldPath, toPath) {
        this.redirects.set(oldPath, toPath);
    }
}