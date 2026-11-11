import type { GalleryCard, GalleryView } from './content';
import {
    coverSource,
    type CoverSource,
    fileUrls,
    getCollection,
    getCollectionView,
    propertyDisplayText,
    relationIds,
    viewCollectionId,
    viewRows,
    visiblePropertyIds,
} from './notion/collection';
import { getBlock, getText, type NotionRecordMap } from './notion/record';
import type { SitePage } from './site';
import { collectionPropertyText } from './notion/properties';

export interface GalleryContext {
    recordMap: NotionRecordMap;
    assets: Record<string, string>;
    sitePageFor: (id: string) => SitePage | undefined;
    warn: (code: string, message: string, blockId: string) => void;
}

export interface GalleryResult {
    views: GalleryView[];
    skippedViewTypes: string[];
}

const columnsBySize = { small: 4, medium: 3, large: 2 } as const;
const sizes = Object.keys(columnsBySize) as GalleryView['size'][];

function resolveImage(url: string, rowId: string, context: GalleryContext): string | undefined {
    const local = context.assets[url];
    if (local) return local;
    if (/^attachment:/i.test(url)) {
        context.warn('asset-missing', `Image ${url} was not downloaded by sync, so it is left out.`, rowId);
        return undefined;
    }
    return url;
}

function cardImage(row: Record<string, any>, cover: CoverSource, context: GalleryContext): string | undefined {
    if (cover.type === 'property') {
        const url = fileUrls(row.properties?.[cover.propertyId])[0];
        return url ? resolveImage(url, row.id, context) : undefined;
    }
    if (cover.type === 'page_cover' && typeof row.format?.page_cover === 'string') {
        const url = row.format.page_cover.startsWith('/')
            ? `https://www.notion.so${row.format.page_cover}`
            : row.format.page_cover;
        return resolveImage(url, row.id, context);
    }
    return undefined;
}

function splitTags(value: string): string[] {
    return value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
}

function mapView(
    block: Record<string, any>,
    blockId: string,
    view: Record<string, any>,
    context: GalleryContext
): GalleryView {
    const viewName = typeof view.name === 'string' ? view.name : '';
    const label = viewName ? `"${viewName}"` : view.id;
    const collectionId = viewCollectionId(block, view);
    const schema: Record<string, any> = getCollection(context.recordMap, collectionId)?.schema ?? {};
    const rows = collectionId
        ? viewRows(context.recordMap, collectionId, view.id)
        : { rowIds: [], found: false, grouped: false };
    const { ids: visible, configured } = visiblePropertyIds(view);
    const cover = coverSource(view, schema);
    const size = sizes.includes(view.format?.gallery_cover_size)
        ? (view.format.gallery_cover_size as GalleryView['size'])
        : 'medium';
    const layout = visible.length ? 'cards' : 'logos';
    const warnedFields = new Set<string>();

    if (!configured) {
        context.warn(
            'gallery-default-fields',
            `Gallery view ${label} has never had its card fields configured, so cards show the title only (Notion's default).`,
            blockId
        );
    }

    if (!rows.found)
        context.warn('gallery-no-data', `Gallery view ${label} has no synced rows. Run sync again.`, blockId);
    if (rows.grouped)
        context.warn(
            'gallery-grouped',
            `Gallery view ${label} is grouped; groups are flattened into one list.`,
            blockId
        );
    if (cover.type === 'page_content') {
        context.warn(
            'gallery-cover-unsupported',
            `Gallery view ${label} uses "page content" as the card preview, which is not supported.`,
            blockId
        );
    }
    const cardLayout = view.format?.card_layout?.mode;
    if (typeof cardLayout === 'string' && cardLayout !== 'default') {
        context.warn(
            'gallery-card-layout',
            `Gallery view ${label} uses card layout "${cardLayout}", which is ignored.`,
            blockId
        );
    }

    const cards: GalleryCard[] = [];
    for (const rowId of rows.rowIds) {
        const row = getBlock(context.recordMap, rowId);
        if (!row) {
            context.warn(
                'gallery-row-missing',
                `Row ${rowId} of gallery view ${label} is missing from the synced data.`,
                blockId
            );
            continue;
        }

        const title = getText(row);
        const canonical = collectionPropertyText(row, context.recordMap, 'meta:canonical:url');
        const href = canonical ?? context.sitePageFor(row.id)?.path;
        const src = cardImage(row, cover, context);
        const card: GalleryCard = {
            id: row.id,
            ...(href ? { href } : {}),
            external: Boolean(canonical && /^https?:\/\//i.test(canonical)),
            ...(src ? { image: { src, alt: title } } : {}),
            tags: [],
            relations: [],
            meta: [],
        };

        if (layout === 'logos') {
            if (!card.image) {
                context.warn(
                    'gallery-logo-missing',
                    `Row "${title || row.id}" has no image, so it is left out of the logo strip.`,
                    blockId
                );
                continue;
            }
            cards.push(card);
            continue;
        }

        for (const propertyId of visible) {
            if (propertyId === 'title') {
                if (title) card.title = title;
                continue;
            }

            const entry = schema[propertyId];
            if (!entry) continue;
            const value = row.properties?.[propertyId];

            if (entry.name === 'Display Label') {
                const text = propertyDisplayText(value, context.recordMap);
                if (text) card.eyebrow = text;
            } else if (entry.name === 'Display Tags' || entry.type === 'multi_select') {
                card.tags.push(...splitTags(propertyDisplayText(value, context.recordMap)));
            } else if (entry.type === 'relation') {
                for (const targetId of relationIds(value)) {
                    const targetTitle = getText(getBlock(context.recordMap, targetId));
                    if (targetTitle) card.relations.push(targetTitle);
                    else
                        context.warn(
                            'relation-target-missing',
                            `Related row ${targetId} (field "${entry.name}") is missing from the synced data.`,
                            row.id
                        );
                }
            } else {
                if (!warnedFields.has(propertyId)) {
                    warnedFields.add(propertyId);
                    context.warn(
                        'gallery-meta-field',
                        `Field "${entry.name}" (${entry.type}) in gallery view ${label} has no card slot; it is shown in the meta line.`,
                        blockId
                    );
                }
                const text = propertyDisplayText(value, context.recordMap);
                if (text) card.meta.push(text);
            }
        }

        cards.push(card);
    }

    return {
        id: view.id,
        name: viewName,
        layout,
        preview: cover.type === 'property' || cover.type === 'page_cover',
        size,
        columns: columnsBySize[size],
        imageFit: view.format?.gallery_cover_aspect === 'contain' ? 'contain' : 'cover',
        cards,
    };
}

export function mapGallery(block: Record<string, any>, blockId: string, context: GalleryContext): GalleryResult {
    const viewIds: string[] = Array.isArray(block.view_ids) ? block.view_ids : [];
    const views = viewIds.map((viewId) => ({ viewId, view: getCollectionView(context.recordMap, viewId) }));
    const galleryViews = views.filter(({ view }) => view?.type === 'gallery');
    const skippedViewTypes = views
        .filter(({ view }) => view?.type !== 'gallery')
        .map(({ view }) => (typeof view?.type === 'string' ? view.type : 'missing'));

    if (galleryViews.length === 0) return { views: [], skippedViewTypes };

    for (const { viewId, view } of views) {
        if (view?.type === 'gallery') continue;
        context.warn(
            'unsupported-view',
            `Database view ${viewId} has type "${view?.type ?? 'missing'}"; only gallery views are rendered.`,
            blockId
        );
    }

    return {
        views: galleryViews.map(({ view }) => mapView(block, blockId, view!, context)),
        skippedViewTypes,
    };
}
