export const MICRO_ANIMATION_TIMEOUT = 350;
export const MICRO_ANIMATION_TIMEOUT_LONG = 500;

export const ELEMENT_PADDING_OFFSET = 25;

type Resolution = { width: number; height: number };

type Resolutions = {
    desktop: Resolution;
    tablet: Resolution;
    mobile: Resolution;
};

export const RESOLUTIONS: Resolutions = {
    desktop: { width: 1440, height: 1080 },
    tablet: { width: 1000, height: 768 },
    mobile: { width: 360, height: 667 }
};
