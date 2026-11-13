import { expect, test } from '@playwright/test';

import type { ContentNode } from '../../utils/cms/content';
import { calloutBanners } from '../../utils/cms/banners';
import { isHidden } from '../../utils/cms/notion/hidden';
import { normalizePage } from '../../utils/cms/normalize';
import { themeFor } from '../../utils/cms/themes';

// Pure data tests for the build-time CMS pipeline: they exercise the normalizer and the call-out
// helpers on inline fixtures, so they need neither a browser nor a running dev server.

/** Record map block in the plain (unwrapped) shape `getBlock` accepts. */
function block(id: string, type: string, extra: Record<string, unknown> = {}) {
    return [id, { id, type, ...extra }];
}

/** Narrows a normalized node to one kind, failing the test if the tree has a different shape. */
function asNode<T extends ContentNode['kind']>(node: ContentNode | undefined, kind: T) {
    if (!node || node.kind !== kind) throw new Error(`Expected a "${kind}" node, got "${node?.kind}".`);
    return node as Extract<ContentNode, { kind: T }>;
}

test.describe('CMS normalizer', () => {
    test('groups consecutive Notion list blocks and keeps nested lists as item children', () => {
        const recordMap = {
            block: Object.fromEntries([
                block('page-1', 'page', {
                    content: ['b-1', 'b-2', 'n-1'],
                    properties: { title: [['Page']] },
                }),
                block('b-1', 'bulleted_list', { properties: { title: [['Item 1']] } }),
                block('b-2', 'bulleted_list', {
                    content: ['b-2-1'],
                    properties: { title: [['Item 2']] },
                }),
                block('b-2-1', 'bulleted_list', { properties: { title: [['Nested']] } }),
                block('n-1', 'numbered_list', { properties: { title: [['Step 1']] } }),
            ]),
        };
        const site = {
            pages: { 'page-1': { siteId: 'root-1', segments: ['s'], path: '/pages/s/', title: 'Page' } },
            assets: {},
            warnings: [],
        };

        const page = normalizePage(recordMap, 'page-1', site);

        // Consecutive same-kind list blocks merge into one list; the numbered list stays separate.
        const section = asNode(page.nodes[0], 'section');
        const [bulletedNode, numberedNode] = section.children;
        const bulleted = asNode(bulletedNode, 'list');
        expect(bulleted.ordered).toBe(false);
        expect(bulleted.items).toHaveLength(2);
        const numbered = asNode(numberedNode, 'list');
        expect(numbered.ordered).toBe(true);
        expect(numbered.items).toMatchObject([{ text: [{ text: 'Step 1' }] }]);

        // The nested list block is a child of its list item, not a sibling.
        const nested = asNode(bulleted.items[1].children[0], 'list');
        expect(nested.ordered).toBe(false);
        expect(nested.items[0]).toMatchObject({ text: [{ text: 'Nested' }] });
        expect(page.warnings).toEqual([]);
    });
});

// Pure data tests for the call-out helpers: no server needed, they only exercise the build-time normalization.
test.describe('CMS call-out helpers', () => {
    test('themeFor maps every Notion call-out color to its template', () => {
        expect(themeFor('default_background')).toEqual({ theme: 'default', scheme: 'light' });
        expect(themeFor(undefined)).toEqual({ theme: 'default', scheme: 'light' });
        expect(themeFor('red_background')).toEqual({ theme: 'red', scheme: 'light' });
        expect(themeFor('orange_background')).toEqual({ theme: 'orange', scheme: 'light' });
        expect(themeFor('gray_background')).toEqual({ theme: 'gray', scheme: 'light' });
        expect(themeFor('purple_background')).toEqual({ theme: 'purple', scheme: 'light' });
        expect(themeFor('yellow_background')).toEqual({ theme: 'yellow', scheme: 'light' });
        // Notion stores the color its UI shows as "green" as "teal".
        expect(themeFor('teal_background')).toEqual(themeFor('green_background'));
        expect(themeFor('blue_background')).toEqual({ theme: 'blue', scheme: 'light' });
        expect(themeFor('pink_background')).toEqual({ theme: 'pink', scheme: 'light' });

        const unknown = themeFor('chartreuse_background');
        expect(unknown.theme).toBe('fallback');
        expect(unknown.scheme).toBe('light');
        expect(unknown.warning).toContain('Unknown block color');
    });

    test('isHidden hides control-panel blocks and every brown-background element', () => {
        expect(isHidden({ properties: { title: '🎛 Control panel' } })).toBe(true);
        expect(isHidden({ properties: { title: '[hidden] internal notes' } })).toBe(true);
        expect(isHidden({ properties: { title: '' }, format: { block_color: 'brown_background' } })).toBe(true);
        expect(isHidden({ properties: { title: '' }, format: { block_color: 'brown' } })).toBe(true);

        expect(isHidden({ properties: { title: 'Visible copy' } })).toBe(false);
        expect(isHidden({ properties: { title: '' }, format: { block_color: 'red_background' } })).toBe(false);
    });

    /** Record map of a page that is a database row with the four RED banner properties. */
    function bannerRecordMap(schemaNames: Record<string, string>) {
        return {
            collection: {
                'col-1': {
                    value: {
                        value: {
                            schema: Object.fromEntries(
                                Object.entries(schemaNames).map(([id, name], index) => [id, { name, type: 'file' }])
                            ),
                        },
                    },
                },
            },
        };
    }

    test('calloutBanners reads the page’s <COLOR> L/M/S Banner properties', () => {
        const recordMap = bannerRecordMap({
            'p-l': 'RED L Banner',
            'p-m': 'RED M Banner',
            'p-s': 'RED S Banner',
        });
        // File properties hold Notion rich text: the file name with an "a" decoration carrying the attachment URL.
        const pageBlock = {
            id: 'page-1',
            parent_table: 'collection',
            parent_id: 'col-1',
            properties: {
                'p-l': [['red-banner.png', [['a', 'attachment:aaa:red-banner.png']]]],
                'p-s': [['red-banner-mobile.png', [['a', 'https://example.com/red-banner-mobile.png']]]],
            },
        };
        const warnings: string[] = [];

        const banners = calloutBanners('red', pageBlock, {
            recordMap,
            assets: { 'attachment:aaa:red-banner.png': '/cms/root-1/notion-assets/red-banner.png' },
            warn: (code) => warnings.push(code),
        });

        expect(banners).toEqual({
            large: '/cms/root-1/notion-assets/red-banner.png',
            small: 'https://example.com/red-banner-mobile.png',
        });
        expect(warnings).toEqual([]);
    });

    test('calloutBanners matches property names case-insensitively', () => {
        const recordMap = bannerRecordMap({ 'p-1': 'red l banner' });
        const pageBlock = {
            id: 'page-1',
            parent_table: 'collection',
            parent_id: 'col-1',
            properties: { 'p-1': [['banner.png', [['a', 'https://example.com/banner.png']]]] },
        };

        expect(calloutBanners('red', pageBlock, { recordMap, assets: {}, warn: () => undefined })).toEqual({
            large: 'https://example.com/banner.png',
        });
    });

    test('calloutBanners also reads plain page properties of pages outside any database', () => {
        const pageBlock = {
            id: 'page-1',
            parent_table: 'block',
            properties: {
                title: [['Page']],
                'GREEN M Banner': [['green.png', [['a', 'https://example.com/green.png']]]],
            },
        };

        expect(calloutBanners('green', pageBlock, { recordMap: {}, assets: {}, warn: () => undefined })).toEqual({
            medium: 'https://example.com/green.png',
        });
    });

    test('calloutBanners reports banners the sync did not download and skips colors without banners', () => {
        const recordMap = bannerRecordMap({ 'p-l': 'RED L Banner' });
        const pageBlock = {
            id: 'page-1',
            parent_table: 'collection',
            parent_id: 'col-1',
            properties: { 'p-l': [['missing.png', [['a', 'attachment:missing:not-downloaded.png']]]] },
        };
        const warnings: string[] = [];
        const context = { recordMap, assets: {}, warn: (code: string) => warnings.push(code) };

        expect(calloutBanners('red', pageBlock, context)).toBeUndefined();
        expect(warnings).toEqual(['banner-asset-missing']);

        // Colors without banner properties (and colors that never carry banners) stay undefined.
        expect(calloutBanners('gray', pageBlock, context)).toBeUndefined();
        expect(calloutBanners('red', { id: 'page-2', properties: {} }, context)).toBeUndefined();
    });
});
