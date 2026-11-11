import { type NotionRecordMap, unwrap } from './record';

export type CoverSource =
    | { type: 'property'; propertyId: string }
    | { type: 'page_cover' }
    | { type: 'page_content' }
    | { type: 'none' };

export interface ViewRows {
    rowIds: string[];
    found: boolean;
    grouped: boolean;
}

export function getCollectionView(recordMap: NotionRecordMap, viewId?: string): Record<string, any> | undefined {
    if (!viewId) return undefined;
    return unwrap<Record<string, any>>(recordMap.collection_view?.[viewId]);
}

export function getCollection(recordMap: NotionRecordMap, collectionId?: string): Record<string, any> | undefined {
    if (!collectionId) return undefined;
    return unwrap<Record<string, any>>(recordMap.collection?.[collectionId]);
}

export function viewCollectionId(block: Record<string, any>, view?: Record<string, any>): string | undefined {
    return view?.format?.collection_pointer?.id ?? block.collection_id ?? block.format?.collection_pointer?.id;
}

export function viewRows(recordMap: NotionRecordMap, collectionId: string, viewId: string): ViewRows {
    const result = (recordMap.collection_query as Record<string, any> | undefined)?.[collectionId]?.[viewId];
    if (!result || typeof result !== 'object') return { rowIds: [], found: false, grouped: false };

    if (Array.isArray(result.collection_group_results?.blockIds)) {
        return { rowIds: result.collection_group_results.blockIds, found: true, grouped: false };
    }
    if (Array.isArray(result.blockIds)) return { rowIds: result.blockIds, found: true, grouped: false };

    const groups = Object.entries(result)
        .filter(([key, value]) => key.startsWith('results:') && Array.isArray((value as any)?.blockIds))
        .flatMap(([, value]) => (value as any).blockIds as string[]);
    return { rowIds: [...new Set(groups)], found: groups.length > 0, grouped: groups.length > 0 };
}

// Notion shows only the title when a gallery view never had its fields configured.
export function visiblePropertyIds(view?: Record<string, any>): { ids: string[]; configured: boolean } {
    const properties = view?.format?.gallery_properties;
    if (!Array.isArray(properties)) return { ids: ['title'], configured: false };
    const ids = properties
        .filter((entry) => entry?.visible === true && typeof entry.property === 'string')
        .map((entry) => entry.property as string);
    return { ids, configured: true };
}

export function schemaPropertyId(schema: Record<string, any>, name: string): string | undefined {
    return Object.entries(schema).find(([, entry]) => entry?.name === name)?.[0];
}

export function coverSource(view: Record<string, any> | undefined, schema: Record<string, any>): CoverSource {
    const cover = view?.format?.gallery_cover;
    if (!cover) {
        const metaImage = schemaPropertyId(schema, 'meta:image');
        return metaImage ? { type: 'property', propertyId: metaImage } : { type: 'none' };
    }
    if (cover.type === 'property' && typeof cover.property === 'string')
        return { type: 'property', propertyId: cover.property };
    if (cover.type === 'page_cover') return { type: 'page_cover' };
    if (cover.type === 'page_content') return { type: 'page_content' };
    return { type: 'none' };
}

function segments(value: unknown): unknown[][] {
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is unknown[] => Array.isArray(item));
}

export function fileUrls(value: unknown): string[] {
    const urls: string[] = [];
    for (const segment of segments(value)) {
        const decorations = Array.isArray(segment[1]) ? segment[1] : [];
        const link = decorations.find(
            (decoration): decoration is [string, string] =>
                Array.isArray(decoration) && decoration[0] === 'a' && typeof decoration[1] === 'string'
        );
        if (link) urls.push(link[1]);
        else if (typeof segment[0] === 'string' && /^(?:attachment:|https?:\/\/)/i.test(segment[0]))
            urls.push(segment[0]);
    }
    return urls;
}

export function relationIds(value: unknown): string[] {
    const ids: string[] = [];
    for (const segment of segments(value)) {
        const decorations = Array.isArray(segment[1]) ? segment[1] : [];
        for (const decoration of decorations) {
            if (Array.isArray(decoration) && decoration[0] === 'p' && typeof decoration[1] === 'string')
                ids.push(decoration[1]);
        }
    }
    return ids;
}

function formatDate(value: Record<string, any>): string {
    const start = typeof value.start_date === 'string' ? value.start_date : '';
    const end = typeof value.end_date === 'string' ? value.end_date : '';
    return end ? `${start} – ${end}` : start;
}

export function propertyDisplayText(value: unknown, recordMap: NotionRecordMap): string {
    return segments(value)
        .map((segment) => {
            const decorations = Array.isArray(segment[1]) ? segment[1] : [];
            for (const decoration of decorations) {
                if (!Array.isArray(decoration)) continue;
                if (decoration[0] === 'd' && decoration[1] && typeof decoration[1] === 'object')
                    return formatDate(decoration[1]);
                if (decoration[0] === 'u' && typeof decoration[1] === 'string') {
                    const user = unwrap<Record<string, any>>(
                        (recordMap.notion_user as Record<string, unknown> | undefined)?.[decoration[1]]
                    );
                    return [user?.given_name, user?.family_name].filter(Boolean).join(' ') || user?.name || '';
                }
            }
            return typeof segment[0] === 'string' && segment[0] !== '‣' ? segment[0] : '';
        })
        .join('')
        .trim();
}
