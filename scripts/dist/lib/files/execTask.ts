import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Dirent } from 'node:fs';

import { newTaskExecutor } from '../pool.js';

export type Opts = { filePath: string, relativePath: string }

export type OnItem<T> = (data: T) => Promise<void>;
export type Filter = (opts: Opts & { file: Dirent }) => boolean;

export async function execFilesTask<R>(
    dir: string,
    scriptPath: string,
    onItem: OnItem<R>,
    filter?: Filter | null
) {
    let rootDir = dir;

    if (rootDir[rootDir.length - 1] !== '/')
        rootDir += '/';

    let isPathsWalked = false;

    function isFinished() {
        return isPathsWalked;
    }

    const [pool, finish, updatePoolState] = newTaskExecutor<Opts, R>(
        scriptPath, onItem, isFinished
    );

    const folders = new Set([rootDir]);

    for (const folder of folders.values()) {
        const files = await readdir(folder, { withFileTypes: true });

        await Promise.all(files.map(async function processFile(file) {
            const filePath = join(folder, file.name);
            const relativePath = filePath.substring(rootDir.length);

            if (filter && !filter({ filePath, relativePath, file })) return;

            if (file.isDirectory()) {
                folders.add(filePath);
                return;
            }

            pool.push({ filePath, relativePath });
        }));
    }

    isPathsWalked = true;
    updatePoolState();

    await finish;
}
