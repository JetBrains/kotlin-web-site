import { env } from 'node:process';

import { algoliasearch } from 'algoliasearch';

export async function writeAlgoliaIndex(objects: Record<string, unknown>[]) {
    await algoliasearch(process.env['WH_SEARCH_USER'], process.env['WH_SEARCH_WRITE_KEY'])
        .replaceAllObjects({
            indexName: process.env['ALGOLIA_INDEX_NAME'],
            objects
        });

    console.log(`Submitting Algolia index objects to ${env['ALGOLIA_INDEX_NAME']} index`);
}
