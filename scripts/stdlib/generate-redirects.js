const { promises: { readdir, readFile } } = require('fs');
const { join } = require('path');
const { OLD_PATH_PREFIX, writeRedirects, writeUnmatched, exists } = require('./utils');
const Redirects = require('./redirect-collector');
const LinksProcessor = require('./links-processor');

/**
 * In general the mapping is next:
 * stdlib /api/latest/jvm/stdlib/  - new /kotlin-stdlib/index.html
 *                                   new /kotlin-reflect/index.html
 * test  /api/latest/kotlin.test/  - new /kotlin-test/index.html
 */

const redirects = new Redirects();
const folders = new Set();

makeStdlibRedirects()
    .then(async () => {
        for (const [from, to] of redirects.redirects.entries()) {
            const direction = to.replace(/^\/api\//, 'api/');

            if (!redirects.matched.get(direction)) {
                const parts = direction.split('/');
                const name = parts.pop();
                const dir = parts.join('/');
                await addFile(dir, name);
            }

            const value = redirects.matched.get(direction);
            if (value) {
                redirects.add(from, value);
                redirects.redirects.delete(from);
            }
        }

        return [...redirects.matched.entries()];
    })
    .then(urls => Promise.all([
        writeRedirects('redirects/stdlib-redirects.yml', urls),
        writeUnmatched('not-found.json', [...redirects.unmatched])
    ]));


async function makeStdlibRedirects() {
    await readFiles(OLD_PATH_PREFIX, '');

    for (const folder of folders) {
        await readFiles(folder);
    }
}

async function readFiles(currentPath) {
    const dirents = await readdir(currentPath, { withFileTypes: true });

    await Promise.all(
        dirents.map(async item => {
            const itemPath = `${currentPath}/${item.name}`;

            if (item.isDirectory())
                folders.add(itemPath);
            else if (item.isFile() && item.name.endsWith('.html'))
                await addFile(currentPath, item.name);
            else
                console.log(`${item.name} is incompatible file for redirect: ${itemPath}.`);
        })
    );
}

const MANUAL_LINKS = {
    'api/latest/jvm/stdlib/kotlin/-any/to-string.html':
        'api/core/kotlin-stdlib/kotlin/to-string.html',

    'api/latest/jvm/stdlib/kotlin/-any/hash-code.html':
        'api/core/kotlin-stdlib/kotlin/hash-code.html',

    'api/latest/jvm/stdlib/kotlin/-enum/compare-to.html':
        'api/core/kotlin-stdlib/kotlin/compare-to.html',
};

function getTargetPath(path, name) {
    return MANUAL_LINKS[path + "/" + name] || (
        new LinksProcessor(path, name)
            .replaceKotlinJvmOptionals()
            .replaceKotlinReflect()
            .dropSomeKotlinPrefixes() // .replaceKotlinPackages()
            .dropEmptyPackages()
            .replaceRootPrefixes()
            .value
    );
}

async function addFile(currentPath, name) {
    const oldPath = join(currentPath, name);
    const expectedPath = getTargetPath(currentPath, name);
    const expectedModulePath = expectedPath.split('/').slice(0, -1).join('/');

    if (await exists(expectedPath)) {
        redirects.add(oldPath, expectedPath);
        return;
    }

    /**
     * Init file was removed
     */
    if (name === '-init-.html') {
        const constructorName = expectedModulePath.split('/').pop();
        const constructorPage = `${expectedModulePath}/${constructorName}.html`;

        if (await exists(constructorPage)) {
            redirects.add(oldPath, `${expectedModulePath}/${constructorName}.html`);
            return;
        }

        const indexPath = `${expectedModulePath}/index.html`;

        if (await exists(indexPath)) {
            redirects.add(oldPath, `${expectedModulePath}/index.html`);
            return;
        }
    }

    const companionPath = `${expectedModulePath}/-companion/${name}`;

    if (await exists(companionPath)) {
        redirects.add(oldPath, companionPath);
        return;
    }

    const insideDefaultPath = `${expectedModulePath}/-default/${name}`;

    if (await exists(insideDefaultPath)) {
        redirects.add(oldPath, insideDefaultPath);
        return;
    }

    const directoryName = `${expectedModulePath}/${name.replace(/\.html$/, '')}`;
    const nowDirectoryName = `${directoryName}/index.html`;

    if (await exists(nowDirectoryName)) {
        redirects.add(oldPath, nowDirectoryName);
        return;
    }

    const typeAliasFile = `${directoryName}-of/index.html`;

    if (await exists(typeAliasFile)) {
        console.log('hasTypeForTypeAlias');
        return redirects.add(oldPath, typeAliasFile);
    }

    const text = await readFile(oldPath, { encoding: 'utf-8' });
    const match = text.match(/<meta http-equiv="refresh" content="0; url=([^"]+)"\/>/);

    if (match) {
        let to = match[1];
        if (to.endsWith('/')) to += 'index.html';
        redirects.addRedirect(oldPath, to);
        return;
    }

    redirects.addUnmatched(oldPath);
}
