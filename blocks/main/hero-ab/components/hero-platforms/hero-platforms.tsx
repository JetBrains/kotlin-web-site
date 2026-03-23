import React, { FC } from 'react';
import { useTL } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints';

import { heroPlatformItems } from '../../data/items';
import { FeaturesCarousel } from './features-carousel';
import { FeaturesSwitcher } from './features-switcher';

export const HeroPlatforms: FC = () => {
    const isTL = useTL();

    return isTL ? (
        <FeaturesCarousel featuresData={heroPlatformItems} />
    ) : (
        <FeaturesSwitcher slides={heroPlatformItems} />
    );
};
