import { type NotionRecordMap, unwrap } from './record';

// Reading database-row properties by their schema name (e.g. `meta:canonical:url`).

export function collectionSchema(block: Record<string, any>, recordMap: NotionRecordMap): Record<string, any> {
    if (block.parent_table !== 'collection' || !block.parent_id) return {};
    return unwrap<Record<string, any>>(recordMap.collection?.[block.parent_id])?.schema ?? {};
}

export function collectionPropertyId(
    block: Record<string, any>,
    recordMap: NotionRecordMap,
    propertyName: string
): string | undefined {
    const property = Object.entries(collectionSchema(block, recordMap)).find(
        ([, value]) => value?.name === propertyName
    )?.[0];
    return property ?? (block.properties?.[propertyName] ? propertyName : undefined);
}

export function propertyText(value: unknown): string {
    if (typeof value === 'string') return value;
    if (!Array.isArray(value)) return '';

    return value
        .map((item) => {
            if (typeof item === 'string') return item;
            return Array.isArray(item) && typeof item[0] === 'string' ? item[0] : '';
        })
        .join('');
}

export function collectionPropertyText(
    block: Record<string, any>,
    recordMap: NotionRecordMap,
    propertyName: string
): string | undefined {
    const propertyId = collectionPropertyId(block, recordMap, propertyName);
    if (!propertyId) return undefined;
    const value = propertyText(block.properties?.[propertyId]).trim();
    return value || undefined;
}
