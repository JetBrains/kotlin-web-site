import { cwd } from 'process';
import { extname, resolve, join } from 'path';
import { promises as fsPromises } from 'fs';

const { readdir, readFile, writeFile } = fsPromises

async function* getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });

    for (const dirent of dirents) {
        const { name } = dirent;
        const fullPath = resolve(dir, name);

        if (dirent.isDirectory()) {
            yield* getFiles(fullPath);
        } else {
            yield { name, fullPath };
        }
    }
}

(async function main() {
    const pages = join(cwd(), 'pages')
    const root = join(pages, 'docs');

    for await (const { name, fullPath } of getFiles(root)) {
        const ext = extname(name);
        let fileName = name.substring(0, name.length - ext.length);

        if (fullPath.indexOf('/reference/coroutines/basics') !== -1) {
            fileName = 'coroutines-basics';
        }
        else if (fileName === 'coroutines-guide') fileName = 'coroutines-intro';
        else if (fileName === 'building-mpp-with-gradle') fileName = 'mpp-intro';
        else if (fileName === 'platform-specific-declarations') fileName = 'mpp-connect-to-apis';
        else if (fileName === 'using-intellij-idea') fileName = 'native-get-started';
        else if (fullPath.indexOf('native/using-') !== -1) fileName = fileName.replace(/^using-/, 'native-');
        else if (fullPath.indexOf('/reference/native/') !== -1) fileName = 'native-' + fileName.replace(/_/g, '-');

        const to = join('docs', fileName);
        const content = await readFile(fullPath, 'utf8');
        const match = content.match(/\nredirect_path: (.+)\n/);

        if (match && match[1]) {
            continue;
        }

        const { href } = new URL(to, 'https://kotlinlang.org');

        await writeFile(fullPath, `---
title: ${to}.html
showAuthorInfo: false
redirect_path: ${href}.html
---

The page is moved to [${to}.md](${to}.md)
`);
    }
})();
