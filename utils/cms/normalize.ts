import type { AccordionItem, CalloutBanners, ContentNode, CustomCss, ListItem, NormalizedPage, RichText } from './content';
import { calloutBanners } from './banners';
import { mapGallery } from './gallery';
import { isHidden } from './notion/hidden';
import {
    canonicalId,
    getBlock,
    getText,
    notionPageIdFromUrl,
    notionUrlForId,
    type NotionRecordMap,
    unwrap,
} from './notion/record';
import type { SiteIndex, SitePage, Warning } from './site';
import { themeFor, type ThemeName } from './themes';

type NormalizeContext = {
    recordMap: NotionRecordMap;
    pageId: string;
    sitePages: Map<string, SitePage>;
    assets: Record<string, string>;
    customCss: CustomCss[];
    warnings: Warning[];
    /** Page-wide banner images per image-based call-out theme, from the page's `<COLOR> L/M/S Banner` properties. */
    banners: Partial<Record<ThemeName, CalloutBanners>>;
};

const headingLevels: Record<string, 1 | 2 | 3 | 4> = {
    header: 1,
    sub_header: 2,
    sub_sub_header: 3,
    header_4: 4,
};

function normalizeId(id: string): string {
    return canonicalId(id) ?? id;
}

function warning(context: NormalizeContext, code: string, message: string, blockId: string): void {
    context.warnings.push({
        code,
        message,
        pageId: context.pageId,
        blockId,
        notionUrl: notionUrlForId(blockId),
    });
}

function sitePageFor(context: NormalizeContext, id: string): SitePage | undefined {
    return context.sitePages.get(normalizeId(id));
}

function richTextFor(value: unknown, blockId: string, context: NormalizeContext): RichText {
    if (typeof value === 'string') return value ? [{ text: value }] : [];
    if (!Array.isArray(value)) return [];

    const segments: RichText = [];
    const isSingleSegment = typeof value[0] === 'string' && Array.isArray(value[1]) && value[1].every(Array.isArray);
    const items = isSingleSegment ? [value] : value;
    for (const item of items) {
        if (typeof item === 'string') {
            if (item) segments.push({ text: item });
            continue;
        }
        if (!Array.isArray(item) || typeof item[0] !== 'string') continue;

        const text = item[0];
        const decorations = Array.isArray(item[1]) ? item[1] : [];
        const segment: RichText[number] = { text };

        for (const decoration of decorations) {
            if (!Array.isArray(decoration)) continue;
            const [kind, value] = decoration;

            if (kind === 'b') segment.bold = true;
            else if (kind === 'i') segment.italic = true;
            else if (kind === 'c') segment.code = true;
            else if (kind === 'h' && typeof value === 'string') segment.color = value;
            else if (kind === 'a' && typeof value === 'string') {
                segment.href = resolveLink(value, blockId, context);
            } else if (kind === 'p' && typeof value === 'string') {
                const pageId = normalizeId(value);
                const page = sitePageFor(context, pageId);
                if (page) {
                    segment.href = page.path;
                    if (segment.text === '‣') segment.text = page.title;
                } else {
                    segment.href = notionUrlForId(pageId);
                    warning(context, 'link-outside-site', `Page mention points outside this site: ${pageId}`, blockId);
                    if (segment.text === '‣') {
                        segment.text = getText(getBlock(context.recordMap, pageId)) || pageId;
                    }
                }
            }
        }

        if (segment.text) segments.push(segment);
    }

    return segments;
}

function resolveLink(href: string, blockId: string, context: NormalizeContext): string {
    const linkedPageId = notionPageIdFromUrl(href);
    if (!linkedPageId) return href;

    const page = sitePageFor(context, linkedPageId);
    if (page) return page.path;

    warning(context, 'link-outside-site', `Link points to a Notion page outside this site: ${linkedPageId}`, blockId);
    return href;
}

function richTextForBlock(block: Record<string, any>, blockId: string, context: NormalizeContext): RichText {
    return richTextFor(block.properties?.title, blockId, context);
}

function plainText(value: unknown): string {
    return getText({ properties: { title: value } });
}

function childIds(block: Record<string, any>): string[] {
    return Array.isArray(block.content)
        ? block.content.filter((id: unknown): id is string => typeof id === 'string')
        : [];
}

function unsupported(
    blockId: string,
    blockType: string,
    context: NormalizeContext,
    code = 'unsupported-block',
    message = `Unsupported Notion block type "${blockType}".`
): ContentNode {
    warning(context, code, message, blockId);
    return {
        id: blockId,
        kind: 'unsupported',
        blockType,
        notionUrl: notionUrlForId(blockId),
    };
}

/** Notion stores every toggle and list item as its own block: merge adjacent ones into one accordion / list. */
function groupSiblings(nodes: ContentNode[]): ContentNode[] {
    const grouped: ContentNode[] = [];
    for (const node of nodes) {
        const previous = grouped[grouped.length - 1];
        if (node.kind === 'accordion' && previous?.kind === 'accordion') {
            grouped[grouped.length - 1] = { ...previous, items: [...previous.items, ...node.items] };
        } else if (node.kind === 'list' && previous?.kind === 'list' && previous.ordered === node.ordered) {
            grouped[grouped.length - 1] = { ...previous, items: [...previous.items, ...node.items] };
        } else {
            grouped.push(node);
        }
    }
    return grouped;
}

function mapChildren(block: Record<string, any>, context: NormalizeContext): ContentNode[] {
    return groupSiblings(
        childIds(block)
            .map((childId) => mapBlock(childId, context))
            .filter((node): node is ContentNode => node !== undefined)
    );
}

function isCssCode(block: Record<string, any>): boolean {
    return block.type === 'code' && plainText(block.properties?.language).trim().toLowerCase() === 'css';
}

function collectCustomCss(block: Record<string, any>, context: NormalizeContext, visited = new Set<string>()): void {
    const blockId = normalizeId(block.id ?? '');
    if (visited.has(blockId)) return;
    visited.add(blockId);

    if (isCssCode(block)) {
        const css = getText(block);
        if (css.trim()) context.customCss.push({ blockId, css });
        return;
    }

    for (const childId of childIds(block)) {
        const child = getBlock(context.recordMap, childId);
        if (!child || child.type === 'page' || child.type === 'collection_view_page') continue;
        collectCustomCss(child, context, visited);
    }
}

function skipHidden(block: Record<string, any>, blockId: string, context: NormalizeContext): void {
    collectCustomCss(block, context);
    warning(context, 'hidden-block-skipped', `Skipped hidden block and its children: ${getText(block)}`, blockId);
}

function normalizedRatio(block: Record<string, any>): number | undefined {
    const ratio = block.format?.column_ratio;
    return typeof ratio === 'number' && Number.isFinite(ratio) && ratio > 0 ? ratio : undefined;
}

function mapColumnList(block: Record<string, any>, blockId: string, context: NormalizeContext): ContentNode {
    const rawColumns = childIds(block).map((id) => ({ id, block: getBlock(context.recordMap, id) }));
    const count = rawColumns.length;
    const weights = rawColumns.map(({ block: column }) =>
        column?.type === 'column' ? normalizedRatio(column) ?? (count ? 1 / count : 0) : count ? 1 / count : 0
    );
    const total = weights.reduce((sum, ratio) => sum + ratio, 0);

    return {
        id: blockId,
        kind: 'grid',
        columns: rawColumns.map(({ id, block: column }, index) => ({
            id: column?.id ?? id,
            ratio: total > 0 ? weights[index] / total : count ? 1 / count : 0,
            children:
                column?.type === 'column'
                    ? mapChildren(column, context)
                    : column
                    ? [mapBlock(column.id ?? id, context)].filter(
                          (node): node is ContentNode => node !== undefined
                      )
                    : [mapBlock(id, context)].filter((node): node is ContentNode => node !== undefined),
        })),
    };
}

function mapColumn(block: Record<string, any>, blockId: string, context: NormalizeContext): ContentNode {
    return {
        id: blockId,
        kind: 'grid',
        columns: [{ id: blockId, ratio: 1, children: mapChildren(block, context) }],
    };
}

function mapButton(block: Record<string, any>, blockId: string, context: NormalizeContext): ContentNode {
    const automationId = block.format?.automation_id;
    const automation = unwrap<Record<string, any>>(context.recordMap.automation?.[automationId]);
    const label = plainText(automation?.properties?.name) || getText(block);
    const actions = Array.isArray(automation?.action_ids) ? automation.action_ids : [];
    const action = actions
        .map((actionId: string) => unwrap<Record<string, any>>(context.recordMap.automation_action?.[actionId]))
        .find((entry: Record<string, any> | undefined) => entry?.type === 'open_page');

    if (!action) {
        warning(context, 'button-no-target', `Button "${label}" has no open-page target.`, blockId);
        return { id: blockId, kind: 'button', label, external: false };
    }

    const targetId = action.config?.target?.page?.id;
    if (typeof targetId !== 'string') {
        warning(context, 'button-no-target', `Button "${label}" has no page target.`, blockId);
        return { id: blockId, kind: 'button', label, external: false };
    }

    const page = sitePageFor(context, targetId);
    if (page) return { id: blockId, kind: 'button', label, href: page.path, external: false };

    warning(
        context,
        'button-external-target',
        `Button "${label}" targets a Notion page outside this site: ${targetId}`,
        blockId
    );
    return { id: blockId, kind: 'button', label, href: notionUrlForId(targetId), external: true };
}

function mapAccordionItem(block: Record<string, any>, blockId: string, context: NormalizeContext): ContentNode {
    const item: AccordionItem = {
        id: blockId,
        title: richTextForBlock(block, blockId, context),
        children: mapChildren(block, context),
    };
    return { id: blockId, kind: 'accordion', items: [item] };
}

function mapListItem(block: Record<string, any>, blockId: string, context: NormalizeContext): ContentNode {
    const item: ListItem = {
        id: blockId,
        text: richTextForBlock(block, blockId, context),
        children: mapChildren(block, context),
    };
    return { id: blockId, kind: 'list', ordered: block.type === 'numbered_list', items: [item] };
}

function mapCollectionView(block: Record<string, any>, blockId: string, context: NormalizeContext): ContentNode {
    const result = mapGallery(block, blockId, {
        recordMap: context.recordMap,
        assets: context.assets,
        sitePageFor: (id) => sitePageFor(context, id),
        warn: (code, message, id) => warning(context, code, message, id),
    });
    if (result.views.length) return { id: blockId, kind: 'gallery', views: result.views };

    const viewTypes = result.skippedViewTypes.length ? ` (${[...new Set(result.skippedViewTypes)].join(', ')})` : '';
    return unsupported(
        blockId,
        `collection_view${viewTypes}`,
        context,
        'unsupported-block',
        `Database block has no gallery view${viewTypes}; only gallery views are rendered.`
    );
}

function imageSource(value: unknown): string {
    if (typeof value === 'string') return value;
    return plainText(value);
}

function mapBlock(blockIdInput: string, context: NormalizeContext): ContentNode | undefined {
    const block = getBlock(context.recordMap, blockIdInput);
    const blockId = block?.id ?? blockIdInput;

    if (!block) return unsupported(blockId, 'unknown', context);
    if (isHidden(block)) {
        skipHidden(block, blockId, context);
        return undefined;
    }

    if (block.type === 'text' && !getText(block).trim()) return undefined;

    const level = headingLevels[block.type];
    if (level && block.format?.toggleable) return mapAccordionItem(block, blockId, context);
    if (level) return { id: blockId, kind: 'heading', level, text: richTextForBlock(block, blockId, context) };

    switch (block.type) {
        case 'text':
            return { id: blockId, kind: 'paragraph', text: richTextForBlock(block, blockId, context) };
        case 'column_list':
            return mapColumnList(block, blockId, context);
        case 'column':
            return mapColumn(block, blockId, context);
        case 'button':
            return mapButton(block, blockId, context);
        case 'image': {
            const source = imageSource(block.properties?.source);
            const alt = plainText(block.properties?.alt) || getText(block);
            const caption = richTextFor(block.properties?.caption, blockId, context);
            return {
                id: blockId,
                kind: 'image',
                src: context.assets[source] ?? source,
                alt,
                ...(caption.length ? { caption } : {}),
            };
        }
        case 'divider':
            return { id: blockId, kind: 'divider' };
        case 'toggle':
            return mapAccordionItem(block, blockId, context);
        case 'bulleted_list':
        case 'numbered_list':
            return mapListItem(block, blockId, context);
        case 'collection_view':
            return mapCollectionView(block, blockId, context);
        case 'code':
            if (isCssCode(block)) {
                return unsupported(
                    blockId,
                    'code',
                    context,
                    'css-outside-hidden',
                    'CSS code block is not inside a hidden (🎛 / [hidden]) block, so it is not applied.'
                );
            }
            return unsupported(blockId, 'code', context);
        case 'callout': {
            // Only reached for call-outs nested inside other blocks: the background is kept to the card.
            const theme = themeFor(block.format?.block_color);
            if (theme.warning) warning(context, 'unknown-theme-color', theme.warning, blockId);
            const banners = context.banners[theme.theme];
            return {
                id: blockId,
                kind: 'callout',
                theme: theme.theme,
                scheme: theme.scheme,
                ...(banners ? { banners } : {}),
                children: mapChildren(block, context),
            };
        }
        default:
            return unsupported(blockId, typeof block.type === 'string' ? block.type : 'unknown', context);
    }
}

export function normalizePage(recordMap: NotionRecordMap, pageId: string, site: SiteIndex): NormalizedPage {
    const normalizedPageId = normalizeId(pageId);
    const root = getBlock(recordMap, normalizedPageId);
    if (!root) throw new Error(`No page block found in the record map for ${normalizedPageId}.`);

    const sitePages = new Map<string, SitePage>();
    for (const [id, page] of Object.entries(site.pages)) sitePages.set(normalizeId(id), page);

    const context: NormalizeContext = {
        recordMap,
        pageId: normalizedPageId,
        sitePages,
        assets: site.assets,
        customCss: [],
        warnings: [],
        banners: {},
    };
    for (const theme of ['red', 'orange', 'yellow', 'green'] as const) {
        const banners = calloutBanners(theme, root, {
            recordMap,
            assets: site.assets,
            warn: (code, message, blockId) => warning(context, code, message, blockId),
        });
        if (banners) context.banners[theme] = banners;
    }
    const nodes: ContentNode[] = [];
    let pending: ContentNode[] = [];
    let pendingId: string | undefined;
    let heroFound = false;

    const flushImplicitSection = () => {
        if (!pending.length) return;
        nodes.push({
            id: pendingId ?? normalizedPageId,
            kind: 'section',
            theme: 'default',
            scheme: 'light',
            hero: false,
            implicit: true,
            children: groupSiblings(pending),
        });
        pending = [];
        pendingId = undefined;
    };

    for (const childId of childIds(root)) {
        const block = getBlock(recordMap, childId);
        const blockId = block?.id ?? childId;

        if (block && isHidden(block)) {
            skipHidden(block, blockId, context);
            continue;
        }
        if (block?.type === 'text' && !getText(block).trim()) continue;

        if (block?.type === 'callout') {
            flushImplicitSection();
            const theme = themeFor(block.format?.block_color);
            if (theme.warning) warning(context, 'unknown-theme-color', theme.warning, blockId);
            const banners = context.banners[theme.theme];
            const children = mapChildren(block, context);
            nodes.push({
                id: blockId,
                kind: 'section',
                theme: theme.theme,
                scheme: theme.scheme,
                hero: !heroFound,
                ...(banners ? { banners } : {}),
                children,
            });
            heroFound = true;
            continue;
        }

        const node = mapBlock(childId, context);
        if (!node) continue;
        if (!pending.length) pendingId = node.id;
        pending.push(node);
    }
    flushImplicitSection();

    const sitePage = sitePages.get(normalizedPageId);
    return {
        id: normalizedPageId,
        path: sitePage?.path ?? '/',
        title: sitePage?.meta?.title ?? sitePage?.title ?? getText(root) ?? normalizedPageId,
        ...(sitePage?.meta?.description ? { description: sitePage.meta.description } : {}),
        nodes,
        customCss: context.customCss,
        warnings: context.warnings,
    };
}
