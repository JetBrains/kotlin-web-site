const fs = require('fs');
const YAML = require('yaml');

class RedirectCollector {
	constructor() {
		this.redirects = [];
		this.unmatched = {
			directory: [],
			file: [],
		};
	}

	add(from, to) {
		this.redirects.push({
			from,
			to
		});
	}

	addUnmatchedDirectory(path) {
		this.unmatched.directory.push(path);
	}

	addUnmatchedFile(path) {
		this.unmatched.file.push(path);
	}

	writeRedirects() {
		fs.writeFileSync('redirects/stdlib-redirects.yml', YAML.stringify(this.redirects), 'utf8');
	}

	writeUnmatched() {
		fs.writeFileSync('not-found.json', JSON.stringify(this.unmatched, null, 4), 'utf8');
	}
}

module.exports = RedirectCollector;
