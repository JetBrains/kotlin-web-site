import React from 'react';
import { ServerSideLayout } from '../../blocks/server-side/layout/server-side-layout';
import { ServerSideHero } from '../../blocks/server-side/hero/hero';
import { ServerSidePerformance } from '../../blocks/server-side/performance/performance';
import FeaturesSection from '../../blocks/server-side/features-section';
import CustomerLogoMarqueeSection from '../../blocks/server-side/customer-logo-marquee';
import { Ecosystem } from '../../blocks/server-side/ecosystem/ecosystem';
import { HowToStart } from '../../blocks/server-side/how-to-start/how-to-start';
import { FavoriteTools } from '../../blocks/server-side/favorite-tools/favorite-tools';
import { AdditionalMaterials } from '../../blocks/server-side/additional-materials/additional-materials';
import { GetStarted } from '../../blocks/server-side/get-started/get-started';

function Index() {
    return (
        <ServerSideLayout title={'Server Side'} ogImageName={'community.png'}>
            <ServerSideHero />
            <CustomerLogoMarqueeSection />
            <FeaturesSection />
            <ServerSidePerformance />
            <Ecosystem />
            <HowToStart />
            <FavoriteTools />
            <AdditionalMaterials />
            <GetStarted />
        </ServerSideLayout>
    );
}

export default Index;
