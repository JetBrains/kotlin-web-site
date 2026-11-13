import { CMS_BASE_PATH } from './constants';
import type { NormalizedPage } from './content';
import type { CmsDataSource } from './data-source';
import { normalizePage } from './normalize';
import { canonicalId, getBlock, getText, notionUrlForId } from './notion/record';
import type { SiteIndex, Warning } from './site';
import { pageMeta, pageSlug, slugify } from './slug';

/** `['about', 'team']` → `/pages/about/team/`. */
export function pagePath(segments: string[], basePath = CMS_BASE_PATH): string {
    return `${basePath.replace(/\/+$/, '')}/${segments.join('/')}/`;
}

/** Manifest path relative to the site root (`/`, `/get-started/`) → route segments below the site slug. */
function manifestSegments(manifestPath: string): string[] {
    return manifestPath
        .split('/')
        .map((segment) => slugify(segment))
        .filter(Boolean);
}

function missingPage(pageId: string, reason: string): Warning {
    return {
        code: 'page-missing',
        message: `${reason}; the page is skipped.`,
        pageId,
        notionUrl: notionUrlForId(pageId),
    };
}

/**
 * Reads every page of every synced site once to assign URLs, titles and metadata.
 *
 * Each site gets the slug of its root page (`super:slug` property or the slugified title) and is served at
 * `/pages/<site slug>/`; its subpages keep the paths assigned by the sync, below that prefix.
 * Sites are processed in root id order, so a duplicate site slug deterministically gets a `-2`, `-3`… suffix.
 * All sites share one index, so links between pages of different sites resolve to site URLs too.
 */
export async function buildSiteIndex(source: CmsDataSource): Promise<SiteIndex> {
    const index: SiteIndex = { pages: {}, assets: {}, warnings: [] };
    const usedSiteSlugs = new Map<string, number>();
    const usedPaths = new Set<string>();

    for (const site of await source.listSites()) {
        index.warnings.push(...site.warnings);
        Object.assign(index.assets, site.assets);

        const rootId = canonicalId(site.rootId) ?? site.rootId;
        const rootRecordMap = await source.getRecordMap(rootId).catch(() => undefined);
        const rootBlock = rootRecordMap && getBlock(rootRecordMap, rootId);
        if (!rootRecordMap || !rootBlock) {
            index.warnings.push(missingPage(rootId, `No root page found for site ${rootId}, so the whole site`));
            continue;
        }

        const rootTitle = getText(rootBlock) || site.pages[rootId]?.title || rootId;
        const baseSlug = pageSlug(rootBlock, rootRecordMap, rootTitle);
        const count = (usedSiteSlugs.get(baseSlug) ?? 0) + 1;
        usedSiteSlugs.set(baseSlug, count);
        const siteSlug = count > 1 ? `${baseSlug}-${count}` : baseSlug;
        if (count > 1) {
            index.warnings.push({
                code: 'duplicate-slug',
                message: `Duplicate site slug "${baseSlug}" renamed to "${siteSlug}".`,
                pageId: rootId,
                notionUrl: notionUrlForId(rootId),
            });
        }

        for (const [rawId, manifestPage] of Object.entries(site.pages)) {
            const id = canonicalId(rawId) ?? rawId;
            if (index.pages[id]) {
                index.warnings.push({
                    code: 'duplicate-page',
                    message: `Page is synced by several sites; the copy in site ${rootId} is skipped.`,
                    pageId: id,
                    notionUrl: notionUrlForId(id),
                });
                continue;
            }

            const recordMap = id === rootId ? rootRecordMap : await source.getRecordMap(id).catch(() => undefined);
            const block = recordMap && getBlock(recordMap, id);
            if (!recordMap || !block) {
                index.warnings.push(missingPage(id, `No synced page block found for ${id}`));
                continue;
            }

            const segments = [siteSlug, ...(id === rootId ? [] : manifestSegments(manifestPage.path))];
            const path = pagePath(segments);
            if (segments.length === 1 && id !== rootId) {
                index.warnings.push(missingPage(id, `Page "${manifestPage.title}" has no path in the sync manifest`));
                continue;
            }
            if (usedPaths.has(path)) {
                index.warnings.push(missingPage(id, `Path ${path} is already taken by another page`));
                continue;
            }
            usedPaths.add(path);

            const meta = pageMeta(block, recordMap);
            index.pages[id] = {
                siteId: rootId,
                segments,
                path,
                title: getText(block) || manifestPage.title || id,
                ...(meta ? { meta } : {}),
            };
        }
    }

    return index;
}

export function findPageId(site: SiteIndex, segments: string[]): string | undefined {
    const path = pagePath(segments);
    return Object.entries(site.pages).find(([, page]) => page.path === path)?.[0];
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
