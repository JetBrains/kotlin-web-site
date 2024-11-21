const { access, writeFile } = require('fs').promises;
const YAML = require('yaml');

const OLD_PATH_PREFIX = 'api/latest';
module.exports.OLD_PATH_PREFIX = OLD_PATH_PREFIX;

module.exports.STDLIB_MODULE_DIR = OLD_PATH_PREFIX + '/jvm/stdlib';
module.exports.TEST_MODULE_DIR = OLD_PATH_PREFIX + '/kotlin.test';

const TARGET_ROOT_PATH = 'api/core';
module.exports.TARGET_ROOT_PATH = TARGET_ROOT_PATH;

module.exports.TARGET_STDLIB_MODULE_DIR = TARGET_ROOT_PATH + '/kotlin-stdlib';
module.exports.TARGET_TEST_MODULE_DIR = TARGET_ROOT_PATH + '/kotlin-test';
module.exports.TARGET_REFLECT_MODULE_DIR = TARGET_ROOT_PATH + '/kotlin-reflect';

module.exports.exists = async function exists(path) {
    try {
        await access(path);
    } catch (e) {
        return false;
    }
    return true;
};

module.exports.writeRedirects = async function writeRedirects(name, urls) {
    const content = urls
        .map(([from, to]) => ({ from: '/' + from, to: '/' + to.replace(/\/index\.html$/, '/') }))
        .sort((a, b) => a.from.localeCompare(b.from));

    console.log(`write ${urls.length} redirects...`);
    await writeFile(name, YAML.stringify(content), 'utf8');
};

module.exports.writeUnmatched = async function writeUnmatched(name, urls) {
    console.log(`write ${urls.length} unmatched pages...`);
    await writeFile(name, JSON.stringify(urls, null, 4), 'utf8');
};
