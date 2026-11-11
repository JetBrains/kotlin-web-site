import { CMS_BASE_PATH } from './constants';
import type { NormalizedPage } from './content';
import type { CmsDataSource } from './data-source';
import { normalizePage } from './normalize';
import { getBlock, getText, notionUrlForId } from './notion/record';
import type { SiteIndex, Warning } from './site';
import { pageMeta, pageSlug } from './slug';

/** `about` → `/pages/about/`. */
export function pagePath(slug: string, basePath = CMS_BASE_PATH): string {
    return `${basePath.replace(/\/+$/, '')}/${slug}/`;
}

/**
 * Reads every page once to assign slugs, titles and metadata. Pages are processed in id order,
 * so a duplicate slug deterministically gets a `-2`, `-3`… suffix.
 */
export async function buildSiteIndex(source: CmsDataSource): Promise<SiteIndex> {
    const index: SiteIndex = { pages: {}, assets: {}, warnings: [] };
    const usedSlugs = new Map<string, number>();

    for (const id of await source.listPageIds()) {
        const recordMap = await source.getRecordMap(id);
        const block = getBlock(recordMap, id);
        if (!block) {
            index.warnings.push({
                code: 'page-missing',
                message: `No page block found for ${id}; the page is skipped.`,
                pageId: id,
                notionUrl: notionUrlForId(id),
            });
            continue;
        }

        const title = getText(block) || id;
        const baseSlug = pageSlug(block, recordMap, title);
        const count = (usedSlugs.get(baseSlug) ?? 0) + 1;
        usedSlugs.set(baseSlug, count);
        const slug = count > 1 ? `${baseSlug}-${count}` : baseSlug;

        if (count > 1) {
            index.warnings.push({
                code: 'duplicate-slug',
                message: `Duplicate slug "${baseSlug}" renamed to "${slug}".`,
                pageId: id,
                notionUrl: notionUrlForId(id),
            });
        }

        const meta = pageMeta(block, recordMap);
        index.pages[id] = { slug, path: pagePath(slug), title, ...(meta ? { meta } : {}) };
    }

    return index;
}

export function findPageId(site: SiteIndex, slug: string): string | undefined {
    return Object.entries(site.pages).find(([, page]) => page.slug === slug)?.[0];
}

/** Each page applies only the custom CSS from its own hidden blocks. */
export async function buildPage(source: CmsDataSource, site: SiteIndex, pageId: string): Promise<NormalizedPage> {
    return normalizePage(await source.getRecordMap(pageId), pageId, site);
}

/** One-line build log summary, e.g. `/pages/about/: 3 content warnings (unsupported-block ×2, nested-callout ×1)`. */
export function summarizeWarnings(path: string, warnings: Warning[]): string | undefined {
    if (!warnings.length) return undefined;
    const counts = new Map<string, number>();
    for (const { code } of warnings) counts.set(code, (counts.get(code) ?? 0) + 1);
    const details = [...counts].map(([code, count]) => `${code} ×${count}`).join(', ');
    return `${path}: ${warnings.length} content warning${warnings.length === 1 ? '' : 's'} (${details})`;
}
