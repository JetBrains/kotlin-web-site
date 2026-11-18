import type { CalloutBanners } from './content';
import { fileUrls } from './notion/collection';
import { collectionSchema } from './notion/properties';
import type { NotionRecordMap } from './notion/record';
import type { ThemeName } from './themes';

/**
 * Page properties that carry the banner images of each image-based call-out color, per breakpoint
 * tier of the styling spec: `XL Banner` for viewports 1440px and above, `L Banner` for 768px to
 * below 1440px and `M Banner` below 768px. The `S Banner` spelling is accepted as a mobile alias,
 * as the authoring guidelines also refer to the mobile banner that way.
 */
const BANNER_PROPERTIES: Record<'red' | 'orange' | 'yellow' | 'green', Record<BannerTier, string[]>> = {
    red: { xlarge: ['RED XL Banner'], large: ['RED L Banner'], medium: ['RED M Banner', 'RED S Banner'] },
    orange: { xlarge: ['ORANGE XL Banner'], large: ['ORANGE L Banner'], medium: ['ORANGE M Banner', 'ORANGE S Banner'] },
    yellow: { xlarge: ['YELLOW XL Banner'], large: ['YELLOW L Banner'], medium: ['YELLOW M Banner', 'YELLOW S Banner'] },
    green: { xlarge: ['GREEN XL Banner'], large: ['GREEN L Banner'], medium: ['GREEN M Banner', 'GREEN S Banner'] },
};

const TIERS = ['xlarge', 'large', 'medium'] as const;

type BannerTier = (typeof TIERS)[number];

/** Property names are matched case-insensitively, so "red l banner" also finds "RED L Banner". */
function normalizeName(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Property ids of the page block keyed by normalized property name: database schema names first, then raw property keys. */
function propertyIdsByName(pageBlock: Record<string, any>, recordMap: NotionRecordMap): Map<string, string> {
    const ids = new Map<string, string>();
    for (const [id, entry] of Object.entries(collectionSchema(pageBlock, recordMap))) {
        if (typeof entry?.name === 'string' && entry.name.trim()) ids.set(normalizeName(entry.name), id);
    }
    for (const key of Object.keys(pageBlock.properties ?? {})) {
        const name = normalizeName(key);
        if (!ids.has(name)) ids.set(name, key);
    }
    return ids;
}

export interface BannerContext {
    recordMap: NotionRecordMap;
    /** Notion image URL → public URL of the copy downloaded by the sync. */
    assets: Record<string, string>;
    warn: (code: string, message: string, blockId: string) => void;
}

/**
 * The `<COLOR> XL/L/M Banner` images of one call-out color, resolved to the copies downloaded by the sync.
 * The page sets them once and every call-out of that color on the page shows them; a tier that is not set
 * is simply left out and the renderer falls back to the next tier or the default background.
 */
export function calloutBanners(theme: ThemeName, pageBlock: Record<string, any>, context: BannerContext): CalloutBanners | undefined {
    const tiers = BANNER_PROPERTIES[theme as keyof typeof BANNER_PROPERTIES];
    if (!tiers || !pageBlock?.properties) return undefined;

    const ids = propertyIdsByName(pageBlock, context.recordMap);
    const banners: CalloutBanners = {};

    for (const tier of TIERS) {
        for (const name of tiers[tier]) {
            const propertyId = ids.get(normalizeName(name));
            if (!propertyId) continue;

            const url = fileUrls(pageBlock.properties[propertyId])[0];
            if (!url) continue;

            const local = context.assets[url];
            if (local) {
                banners[tier] = local;
            } else if (/^attachment:/i.test(url)) {
                context.warn(
                    'banner-asset-missing',
                    `Banner image of ${name} was not downloaded by the sync, so the default background is shown.`,
                    pageBlock.id ?? ''
                );
            } else {
                banners[tier] = url;
            }
            break;
        }
    }

    return banners.xlarge ?? banners.large ?? banners.medium ? banners : undefined;
}
