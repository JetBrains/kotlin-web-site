import { env } from 'node:process';

import { algoliasearch } from 'algoliasearch';
import { join } from 'node:path';
import { REPORT_FOLDER } from '../files/index.js';
import { writeFile } from 'node:fs/promises';

export async function writeAlgoliaIndex(objects: Record<string, unknown>[]) {
    const result = await algoliasearch(process.env['WH_SEARCH_USER'], process.env['WH_SEARCH_WRITE_KEY'])
        .replaceAllObjects({
            indexName: process.env['ALGOLIA_INDEX_NAME'],
            objects
        });

    console.log(`Submitting Algolia index objects to ${env['ALGOLIA_INDEX_NAME']} index`);

    await writeFile(join(REPORT_FOLDER, 'submitting-result.json'), JSON.stringify(result, null, 2));
}
