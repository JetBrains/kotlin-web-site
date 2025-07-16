import React from 'react';
import { ServerSideLayout } from '../../blocks/server-side/layout/server-side-layout';
import { ServerSideHero } from '../../blocks/server-side/hero/hero';
import { ServerSidePerformance } from '../../blocks/server-side/performance/performance';
import FeaturesSection from '../../blocks/server-side/features-section';
import CustomerLogoMarqueeSection from '../../blocks/server-side/customer-logo-marquee';

function Index() {
    return (
        <ServerSideLayout title={'Server Side'} ogImageName={'community.png'}>
            <ServerSideHero />
            <ServerSidePerformance />
            <FeaturesSection />
            <CustomerLogoMarqueeSection />
        </ServerSideLayout>
    );
}

export default Index;
