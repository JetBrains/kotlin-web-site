import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { withSearchParser } from '../search/records.js';

export const ROOT_DIR = resolve(import.meta.dirname, '..', '..', '..', '..');
export const DIST_FOLDER = join(ROOT_DIR, 'dist/');
export const REPORT_FOLDER = join(ROOT_DIR, 'reports/');
export const DATA_FOLDER = join(ROOT_DIR, 'data/');

export const statsPromise = (async function loadStats() {
    if (!withSearchParser) return {};
    return JSON.parse(await readFile(join(DATA_FOLDER, 'page_views_map.json'), { encoding: 'utf-8' }));
})();
