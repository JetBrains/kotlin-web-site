import { useCallback, useEffect, useState } from 'react';
import { prepare, layout } from '@chenglou/pretext';
import { prepareRichInline, measureRichInlineStats } from '@chenglou/pretext/rich-inline';
import type { CaseItem } from '../case-studies';

// Card text typography (rs-text-2): JetBrains Sans 16px, line-height 24px, letter-spacing 0.0015em.
const FONT_REGULAR = '400 16px "JetBrains Sans"';
const FONT_BOLD = '700 16px "JetBrains Sans"'; // **bold** renders as <strong>
const LINE_HEIGHT = 24;
const LETTER_SPACING = 0.024;

// Card layout constants (see case-studies-card.module.css).
const CARD_BORDERS = 2;
const CONTENT_PADDING = 32;
const CONTENT_GAP = 24;
const PARAGRAPH_MARGIN = 16;
const LOGO_HEIGHT = 64;
const SIGNATURE_HEIGHT = 48;
const LINK_HEIGHT = 24;
const TECHNOLOGIES_HEIGHT = 24;
const YOUTUBE_ASPECT = 9 / 16; // player preview is maxresdefault.jpg, 1280×720

const FONT_SAMPLE = 'Kotlin case study success story — read the full story';
const FONTS_TIMEOUT = 1500;
const PROBE_TIMEOUT = 4000;

// Prepared text handles, keyed by source — pretext layout is pure arithmetic over them.
const preparedRich = new Map<string, ReturnType<typeof prepareRichInline>>();
const preparedPlain = new Map<string, ReturnType<typeof prepare>>();

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Split a paragraph into **bold** runs — mirrors what markdown-to-jsx renders.
function paragraphRuns(paragraph: string) {
    return paragraph
        .split(/\*\*([^*]+)\*\*/g)
        .map((text, index) => ({ text, font: index % 2 ? FONT_BOLD : FONT_REGULAR, letterSpacing: LETTER_SPACING }))
        .filter(run => run.text.length > 0);
}

function measureParagraph(paragraph: string, maxWidth: number): number {
    if (paragraph.includes('**')) {
        let prepared = preparedRich.get(paragraph);
        if (!prepared) {
            prepared = prepareRichInline(paragraphRuns(paragraph));
            preparedRich.set(paragraph, prepared);
        }
        return measureRichInlineStats(prepared, maxWidth).lineCount * LINE_HEIGHT;
    }
    const key = `${FONT_REGULAR}|${paragraph}`;
    let prepared = preparedPlain.get(key);
    if (!prepared) {
        prepared = prepare(paragraph, FONT_REGULAR, { letterSpacing: LETTER_SPACING });
        preparedPlain.set(key, prepared);
    }
    return layout(prepared, maxWidth, LINE_HEIGHT).height;
}

export type CaseCardImageAspect = { width: number; height: number } | null;

// Intrinsic image sizes probed so far, shared across mounts: path → size, null = failed probe.
const probeCache = new Map<string, CaseCardImageAspect>();

// Card height at a column width, or null while a media image is not probed yet.
// Text is measured by pretext without touching the DOM; the rest of the card is data-driven constants.
export function computeCaseCardHeight(
    item: CaseItem,
    mode: 'rock' | 'classic',
    columnWidth: number,
    imageAspects: ReadonlyMap<string, CaseCardImageAspect>,
): number | null {
    const textWidth = columnWidth - CARD_BORDERS - CONTENT_PADDING * 2;
    if (textWidth <= 0) return null;

    const parts: number[] = [];

    const propertyName = mode === 'rock' ? 'alternateLogo' : 'logo';
    const logos = (item[propertyName] as string[] | undefined) || item.logo;
    if (logos?.length) parts.push(LOGO_HEIGHT);

    if (item.description) {
        const paragraphs = item.description.trim().split(/\n\s*\n/).filter(p => p.length > 0);
        if (paragraphs.length) {
            const textHeight = paragraphs.reduce((sum, p) => sum + measureParagraph(p, textWidth), 0);
            parts.push(textHeight + PARAGRAPH_MARGIN * (paragraphs.length - 1));
        }
    }

    if (item.signature) parts.push(SIGNATURE_HEIGHT);
    if (item.link) parts.push(LINK_HEIGHT);
    if (item.platforms?.length || item.frameworks?.length) parts.push(TECHNOLOGIES_HEIGHT);

    const contentHeight = parts.reduce((a, b) => a + b, 0) + CONTENT_GAP * Math.max(0, parts.length - 1);

    let mediaHeight: number | null = 0;
    if (item.media) {
        const mediaWidth = columnWidth - CARD_BORDERS;
        if (item.media.type === 'youtube') {
            mediaHeight = mediaWidth * YOUTUBE_ASPECT;
        } else {
            const aspect = imageAspects.get(item.media.path);
            if (aspect === undefined) {
                mediaHeight = null; // not probed yet
            } else if (aspect) {
                mediaHeight = mediaWidth * aspect.height / aspect.width;
            }
            // else: failed probe → 0, same as measuring before the image loads
        }
    }
    if (mediaHeight === null) return null;

    return CARD_BORDERS + CONTENT_PADDING * 2 + contentHeight + mediaHeight;
}

function probeImageAspect(path: string): Promise<void> {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            probeCache.set(path, { width: img.naturalWidth, height: img.naturalHeight });
            resolve();
        };
        img.onerror = () => {
            probeCache.set(path, null);
            resolve();
        };
        img.src = path;
    });
}

export interface CaseCardHeights {
    getItemHeight: (item: CaseItem, ctx: { columnWidth: number }) => number | null;
}

export function useCaseCardHeights(items: CaseItem[], mode?: 'rock' | 'classic'): CaseCardHeights {
    const [fontsReady, setFontsReady] = useState(false);
    // Snapshot of the probe cache — a fresh instance re-triggers the grid distribution.
    const [imageAspects, setImageAspects] = useState<ReadonlyMap<string, CaseCardImageAspect>>(
        () => new Map(probeCache),
    );

    // Pretext measures through canvas — web fonts must be loaded first. The race keeps a
    // blocked font CDN from freezing the grid on the cyclic fallback forever.
    useEffect(() => {
        if (!document.fonts) {
            setFontsReady(true);
            return;
        }
        let cancelled = false;
        Promise.race([
            Promise.all([FONT_REGULAR, FONT_BOLD].map(font => document.fonts.load(font, FONT_SAMPLE))),
            sleep(FONTS_TIMEOUT),
        ]).then(() => { if (!cancelled) setFontsReady(true); });
        return () => { cancelled = true; };
    }, []);

    // Probe intrinsic sizes of local media images (YouTube is a fixed 16:9).
    useEffect(() => {
        const uncached: string[] = [];
        for (const item of items) {
            if (item.media?.type === 'image' && !probeCache.has(item.media.path)) uncached.push(item.media.path);
        }
        if (!uncached.length) return;

        let cancelled = false;
        Promise.race([
            Promise.all(uncached.map(probeImageAspect)),
            sleep(PROBE_TIMEOUT),
        ]).then(() => {
            // Treat anything still unresolved after the timeout as failed so the grid never stalls.
            for (const path of uncached) {
                if (!probeCache.has(path)) probeCache.set(path, null);
            }
            if (!cancelled) setImageAspects(new Map(probeCache));
        });
        return () => { cancelled = true; };
    }, [items]);

    const getItemHeight = useCallback(
        (item: CaseItem, ctx: { columnWidth: number }) => {
            if (!fontsReady) return null;
            return computeCaseCardHeight(item, mode ?? 'classic', ctx.columnWidth, imageAspects);
        },
        [fontsReady, imageAspects, mode],
    );

    return { getItemHeight };
}
