import type { CSSProperties } from 'react';
import type { CalloutBanners } from '../../../utils/cms/content';

type BannerVars = CSSProperties & Record<'--nw-banner-xl' | '--nw-banner-l' | '--nw-banner-m', string | undefined>;

/**
 * The page's `<COLOR> XL/L/M Banner` images as CSS custom properties consumed by `callouts.css`:
 * `--nw-banner-l` is shown by default, `--nw-banner-xl` from 1440px and `--nw-banner-m` below 768px.
 * A tier that is not set falls back to the next one, so a single banner image covers every breakpoint.
 * Returns nothing when the page sets no banners, leaving the template's default background in place.
 */
export function bannerStyle(banners?: CalloutBanners): BannerVars | undefined {
    if (!banners) return undefined;

    const large = banners.large ?? banners.medium ?? banners.xlarge;
    if (!large) return undefined;

    // Custom properties substitute verbatim, so the paths must already be valid `url()` tokens.
    const url = (value: string) => `url(${JSON.stringify(value)})`;

    return {
        '--nw-banner-xl': url(banners.xlarge ?? large),
        '--nw-banner-l': url(large),
        '--nw-banner-m': url(banners.medium ?? large),
    };
}
