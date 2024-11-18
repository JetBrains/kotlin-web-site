import { env } from 'node:process';
import { mkdir } from 'node:fs/promises';
import { EventEmitter } from 'events'

import { DIST_FOLDER, REPORT_FOLDER } from '../lib/files/index.js';
import { execFilesTask, Filter } from '../lib/files/execTask.js';
import { writeReports } from './reports/write.js';
import { Metadata } from './metadata.js';

console.time('Data successfully built');

const TASK_PATH = import.meta.dirname + '/task';

function preFilterFiles({ relativePath: path }: Parameters<Filter>[0]) {
    const isSkip = (
        // optimize by path "api/core/older" takes more than 1 minute only for filesystem iteration
        (path.startsWith('api/') && (path.endsWith('/older'))) ||
        path === 'spec' ||
        path === 'api/latest'
    );

    if (isSkip) console.log(`skip: /${path} skipped by path`);
    return !isSkip;
}

let result: Metadata[] = [];

EventEmitter.defaultMaxListeners = 15

await execFilesTask(
    DIST_FOLDER, TASK_PATH,
    async function addToReport(item: Metadata) {
        result.push(item);
    },
    env['WH_SHORT_REPORT'] ? preFilterFiles : null
);

result.sort(([path1], [path2]) => path1.localeCompare(path2));

await mkdir(REPORT_FOLDER, { recursive: true });
await writeReports(result);

console.timeEnd('Data successfully built');
