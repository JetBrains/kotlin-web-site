import fs from 'fs';
import path from 'path';
import { CMS_ASSETS_PATH } from './constants';
import type { NotionRecordMap } from './notion/record';
import type { Warning } from './site';

/** A page as listed by the sync manifest. `path` is relative to the site root: `/` for the root page. */
export interface CmsManifestPage {
    slug: string;
    path: string;
    title: string;
}

/** One synced Notion tree: a root page and every page discovered from it. */
export interface CmsSiteManifest {
    rootId: string;
    sourceUrl?: string;
    /** Keyed by the canonical (dashed) Notion page id. */
    pages: Record<string, CmsManifestPage>;
    /** Notion image URL → public URL of the downloaded copy. */
    assets: Record<string, string>;
    /** Problems reported by the sync itself, e.g. pages it could not fetch. */
    warnings: Warning[];
}

/**
 * Where CMS content comes from. Pages are generated only through this interface,
 * so the local source below can be replaced with a real CMS fetch without touching the renderer.
 */
export interface CmsDataSource {
    /** Every synced site, ordered by root id. */
    listSites(): Promise<CmsSiteManifest[]>;
    /** Raw Notion record map of one page of any site. */
    getRecordMap(pageId: string): Promise<NotionRecordMap>;
}

const ID = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/;

async function readJson<T>(file: string): Promise<T> {
    return JSON.parse(await fs.promises.readFile(file, 'utf8')) as T;
}

/** `/notion-assets/x.png` (relative to the synced site's `public/`) → `/cms/<root id>/notion-assets/x.png`. */
function publicAssetUrl(rootId: string, url: string): string {
    return url.startsWith('/') ? `${CMS_ASSETS_PATH}/${rootId}${url}` : url;
}

/**
 * Local data source: the output of `npm run sync` in the cms-poc project, one folder per synced root page:
 *
 * ```
 * data/cms/<root id>/data/site.json            manifest: pages, slugs, downloaded assets, sync warnings
 * data/cms/<root id>/data/pages/<page id>.json Notion record map of one page
 * data/cms/<root id>/public/notion-assets/…    downloaded images, copied to `public/cms/<root id>/` by `yarn generate-data`
 * ```
 */
export function createLocalDataSource(dataDir = path.join(process.cwd(), 'data', 'cms')): CmsDataSource {
    const siteDirs = async () =>
        (await fs.promises.readdir(dataDir, { withFileTypes: true }))
            .filter((entry) => entry.isDirectory() && ID.test(entry.name))
            .map((entry) => entry.name)
            .sort();

    return {
        listSites: async () =>
            Promise.all(
                (await siteDirs()).map(async (rootId) => {
                    const manifest = await readJson<Partial<CmsSiteManifest>>(
                        path.join(dataDir, rootId, 'data', 'site.json')
                    );
                    return {
                        rootId,
                        ...(manifest.sourceUrl ? { sourceUrl: manifest.sourceUrl } : {}),
                        pages: manifest.pages ?? {},
                        assets: Object.fromEntries(
                            Object.entries(manifest.assets ?? {}).map(([source, url]) => [
                                source,
                                publicAssetUrl(rootId, url),
                            ])
                        ),
                        warnings: manifest.warnings ?? [],
                    };
                })
            ),
        getRecordMap: async (pageId) => {
            if (!ID.test(pageId)) throw new Error(`Invalid CMS page id "${pageId}".`);
            for (const rootId of await siteDirs()) {
                const file = path.join(dataDir, rootId, 'data', 'pages', `${pageId}.json`);
                if (fs.existsSync(file)) return readJson<NotionRecordMap>(file);
            }
            throw new Error(`No synced record map for CMS page "${pageId}" in ${dataDir}.`);
        },
    };
}

export const localDataSource = createLocalDataSource();
