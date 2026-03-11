import React, { FC, useCallback } from 'react';
import classNames from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { useTL } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints';

import { featureSlideshowItems } from './items';
import { FeaturesCarousel } from '../features-carousel';
import { FeaturesSwitcher } from '../features-switcher';
import { trackEvent } from '../../../utils/event-logger';
import { useIntersectionTracking } from '../../../utils/use-untersection-tracking';

const FeaturesSection: FC = () => {
    const textCn = useTextStyles();
    const isTL = useTL();

    const handleTabClick = useCallback((label: string) => {
        trackEvent({
            eventAction: 'kt_server_side_safety_click',
            eventLabel: label
        });
    }, []);

    const handleIntersection = useCallback(() => {
        trackEvent({
            eventAction: 'kt_server_side_safety_read'
        });
    }, []);

    const sectionRef = useIntersectionTracking(handleIntersection);

    return (
        <section className="ktl-layout ktl-layout--center" ref={sectionRef}>
            <div className="ktl-container section-offset" id={'safety'}>
                <h2 className={classNames(textCn('rs-h1'))}>
                    Safety: fewer production bugs and crashes
                </h2>

                {isTL ? (
                    <FeaturesCarousel featuresData={featureSlideshowItems}  />
                ) : (
                    <FeaturesSwitcher slides={featureSlideshowItems} onTab={handleTabClick} />
                )}
            </div>
        </section>
    );
};

export default FeaturesSection;
