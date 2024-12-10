import { FileType } from '../../lib/files/type.js';
import { statsPromise } from '../../lib/files/index.js';
import { Metadata, MetaPayload } from '../metadata.js';

export function makeFileReport([url, { type }]: Metadata) {
    return `  ${JSON.stringify(url)}: ${JSON.stringify(type)},\n`;
}

export const SITEMAP_OPEN_TEXT = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

export const SITEMAP_CLOSE_TEXT = '</urlset>';

function getPagePriority(url: string, type: FileType) {
    if (new URL(url).pathname === '/' || type === 'Page_Documentation')
        return '1';

    if (type.startsWith('Page_API'))
        return '0.5';

    if (type === 'Page_LegacyDocumentation')
        return '0.2';

    return '0.8';
}

function getModified(modified?: MetaPayload['modified']) {
    if (!modified) return '';
    return `<lastmod>${new Date(modified).toISOString()}</lastmod>`;
}

export function makeSitemapItem(url: string, { type, modified }: MetaPayload) {
    return `<url><loc>${url}</loc><priority>${getPagePriority(url, type)}</priority>${getModified(modified)}</url>\n`;
}

export type FileStats = Partial<Record<FileType, number>>;

export function makeStatsReport(stats: FileStats) {
    return Object.entries(stats)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}, ${value}`).join('\n');
}

const BACKWARD_COMPATIBILITY_ORDER = [
    'objectID', 'headings', 'mainTitle', 'pageTitle', 'content',
    'url', 'type', 'parent', 'pageViews', 'product'
];

const INTERNAL_KEYS = ['modified'];

export async function makeSearchItem([url, data]: Metadata) {
    let records = data.records;

    const stats = await statsPromise;

    return records.map(function remapRecord(record) {
        const amount = stats[url];

        if (amount) record.pageViews = amount;

        const item = Object.entries(record)
            .filter(([key]) => !INTERNAL_KEYS.includes(key))
            .sort(([a], [b]) =>
                // keep order for easier compare with old files
                // with this sorting every parser could create record kys in random order
                BACKWARD_COMPATIBILITY_ORDER.indexOf(a) - BACKWARD_COMPATIBILITY_ORDER.indexOf(b))

            .map(function processValue([key, val]) {
                // do safe for algolia record.
                // ToDo: if you want use tags in algolia drop it,
                //  but remember **ALL** key and values should be escaped in-place.
                if (typeof val === 'string') val = val
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');

                return [key, val];
            });

        return Object.fromEntries(item);
    });
}
