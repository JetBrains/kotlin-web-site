import fs from 'fs';
import path from 'path';
import type { NotionRecordMap } from './notion/record';

/**
 * Where CMS content comes from. Pages are generated only through this interface,
 * so the mock below can be replaced with a real CMS fetch without touching the renderer.
 */
export interface CmsDataSource {
    /** Canonical (dashed) Notion ids of every page to generate. */
    listPageIds(): Promise<string[]>;
    /** Raw Notion record map of one page. */
    getRecordMap(pageId: string): Promise<NotionRecordMap>;
}

const PAGE_ID = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/;
const PAGE_FILE = /^([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})\.json$/;

/**
 * Mock data source: one Notion record map per page, committed as `data/pages/<page id>.json`
 * (produced by `npm run sync` in the cms-poc project). Every file becomes a page.
 */
export function createMockDataSource(dataDir = path.join(process.cwd(), 'data', 'pages')): CmsDataSource {
    return {
        listPageIds: async () =>
            (await fs.promises.readdir(dataDir))
                .map((file) => PAGE_FILE.exec(file)?.[1])
                .filter((id): id is string => Boolean(id))
                .sort(),
        getRecordMap: async (pageId) => {
            if (!PAGE_ID.test(pageId)) throw new Error(`Invalid CMS page id "${pageId}".`);
            const json = await fs.promises.readFile(path.join(dataDir, `${pageId}.json`), 'utf8');
            return JSON.parse(json) as NotionRecordMap;
        },
    };
}

export const mockDataSource = createMockDataSource();
