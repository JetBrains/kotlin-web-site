import { collectionPropertyText } from './notion/properties';
import type { NotionRecordMap } from './notion/record';
import type { SitePage } from './site';

export function slugify(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/** The `super:slug` property of a database row wins; otherwise the slugified page title. */
export function pageSlug(block: Record<string, any>, recordMap: NotionRecordMap, title: string): string {
    const preferred = collectionPropertyText(block, recordMap, 'super:slug');
    return slugify(preferred ?? '') || slugify(title) || 'page';
}

/** `meta:title` / `meta:description` properties of a database row. */
export function pageMeta(block: Record<string, any>, recordMap: NotionRecordMap): SitePage['meta'] {
    const title = collectionPropertyText(block, recordMap, 'meta:title');
    const description = collectionPropertyText(block, recordMap, 'meta:description');
    if (!title && !description) return undefined;
    return { ...(title ? { title } : {}), ...(description ? { description } : {}) };
}
