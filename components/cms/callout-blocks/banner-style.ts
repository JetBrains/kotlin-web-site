import type { CSSProperties } from 'react';
import type { CalloutBanners } from '../../../utils/cms/content';

type BannerVars = CSSProperties & Record<'--nw-banner-l' | '--nw-banner-m' | '--nw-banner-s', string | undefined>;

/**
 * The page's `<COLOR> L/M/S Banner` images as CSS custom properties consumed by `callouts.css`:
 * `--nw-banner-m` is shown by default, `--nw-banner-l` from 1920px and `--nw-banner-s` up to 768px.
 * A size that is not set falls back to the next one, so a single banner image covers every breakpoint.
 * Returns nothing when the page sets no banners, leaving the template's default background in place.
 */
export function bannerStyle(banners?: CalloutBanners): BannerVars | undefined {
    if (!banners) return undefined;

    const medium = banners.medium ?? banners.large ?? banners.small;
    if (!medium) return undefined;

    return {
        '--nw-banner-l': banners.large ?? medium,
        '--nw-banner-m': medium,
        '--nw-banner-s': banners.small ?? medium,
    };
}
