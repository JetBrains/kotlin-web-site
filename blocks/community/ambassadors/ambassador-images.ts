function asset(name: string) {
    const src = `/images/community/ambassadors/${name}.webp`;
    return {
        src,
        srcSet: `${src} 1x, ${src.replace(/(\.\w+)$/, '@2x$1')} 2x, ${src.replace(/(\.\w+)$/, '@3x$1')} 3x`,
    };
}

export const AMBASSADOR_IMAGE_SIGN = { src: '/images/community/ambassadors/sign.svg' };
export const AMBASSADOR_IMAGE_SEAL = asset('seal');
export const AMBASSADOR_IMAGE_K_ELEMENT = asset('k-element');
export const AMBASSADOR_IMAGE_PLATE = asset('plate-ambassador');
export const AMBASSADOR_IMAGE_BADGE_CREATOR = asset('badge-creator');
export const AMBASSADOR_IMAGE_BADGE_EDUCATOR = asset('badge-educator');
export const AMBASSADOR_IMAGE_BADGE_CONTRIBUTOR = asset('badge-contributor');
