export interface NotionRecordMap {
    block?: Record<string, unknown>;
    automation?: Record<string, unknown>;
    automation_action?: Record<string, unknown>;
    collection?: Record<string, unknown>;
    collection_view?: Record<string, unknown>;
    collection_query?: Record<string, unknown>;
    signed_urls?: Record<string, string>;
    [key: string]: unknown;
}

export function unwrap<T = Record<string, unknown>>(record: unknown): T | undefined {
    const value = (record as any)?.value;
    return (value?.value ?? value ?? record) as T | undefined;
}

export function canonicalId(id?: string | null): string | undefined {
    if (!id) return undefined;
    const value = id.split('?')[0];
    const compactId = value.match(/\b([\da-f]{32})\b/i)?.[1];
    const dashedId =
        compactId ?? value.match(/\b([\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12})\b/i)?.[1]?.replaceAll('-', '');
    if (!dashedId) return id.toLowerCase();
    return `${dashedId.slice(0, 8)}-${dashedId.slice(8, 12)}-${dashedId.slice(12, 16)}-${dashedId.slice(
        16,
        20
    )}-${dashedId.slice(20)}`.toLowerCase();
}

export function getBlock(recordMap: NotionRecordMap, id?: string | null): Record<string, any> | undefined {
    if (!id || !recordMap.block) return undefined;
    const direct = unwrap<Record<string, any>>(recordMap.block[id]);
    if (direct) return direct;

    const canonical = canonicalId(id);
    const entry = Object.entries(recordMap.block).find(([key, value]) => {
        const block = unwrap<Record<string, any>>(value);
        return canonicalId(block?.id ?? key) === canonical;
    })?.[1];

    return unwrap<Record<string, any>>(entry);
}

export function getText(block?: Record<string, any> | null): string {
    const title = block?.properties?.title;
    if (typeof title === 'string') return title;
    if (!Array.isArray(title)) return '';

    return title.map((item) => (Array.isArray(item) && typeof item[0] === 'string' ? item[0] : '')).join('');
}

export function notionUrlForId(id: string): string {
    const pageId = canonicalId(id) ?? id;
    return `https://www.notion.so/${pageId.replaceAll('-', '')}`;
}

export function notionPageIdFromUrl(href?: string): string | undefined {
    if (!href) return undefined;

    try {
        const url = new URL(href);
        const hostname = url.hostname.toLowerCase();
        if (hostname !== 'notion.so' && !hostname.endsWith('.notion.so') && !hostname.endsWith('.notion.site')) {
            return undefined;
        }
        return canonicalId(href);
    } catch {
        return undefined;
    }
}
