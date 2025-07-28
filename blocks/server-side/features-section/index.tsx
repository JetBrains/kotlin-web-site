import React, { FC } from 'react';
import classNames from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { useTL } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints';

import { featureSlideshowItems } from './items';
import { FeaturesCarousel } from '../features-carousel';
import { FeaturesSwitcher } from '../features-switcher';

const FeaturesSection: FC = () => {
    const textCn = useTextStyles();
    const isTL = useTL();

    return (
        <section className="ktl-layout ktl-layout--center">
            <div className="ktl-container section-offset">
                <h2 className={classNames(textCn('rs-h1'))}>
                    Safety: fewer production bugs and crashes
                </h2>

                {isTL ? (
                    <FeaturesCarousel featuresData={featureSlideshowItems} className="" />
                ) : (
                    <FeaturesSwitcher slides={featureSlideshowItems} className="" />
                )}
            </div>
        </section>
    );
};

export default FeaturesSection;
