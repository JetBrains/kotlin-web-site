const fs = require('fs');

class RedirectCollector {
	constructor() {
		this.redirects = {};
		this.unmatched = {
			directory: [],
			file: [],
		};
	}

	add(from, to) {
		this.redirects[from] = to;
	}

	addUnmatchedDirectory(path) {
		this.unmatched.directory.push(path);
	}

	addUnmatchedFile(path) {
		this.unmatched.file.push(path);
	}

	writeRedirects() {
		fs.writeFileSync('stdlib-redirects.json', JSON.stringify(this.redirects, null, 4), 'utf8');
	}

	writeUnmatched() {
		fs.writeFileSync('not-found.json', JSON.stringify(this.unmatched, null, 4), 'utf8');
	}
}

module.exports = RedirectCollector;
