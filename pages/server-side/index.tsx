import React from 'react';
import { Button } from '@rescui/button';
import { SERVER_SIDE_TITLE, SERVER_SIDE_URL } from '@jetbrains/kotlin-web-site-ui/out/components/header';
import { LandingLayout } from '../../components/landing-layout/landing-layout';
import { ServerSideHero } from '../../blocks/server-side/hero/hero';
import { ServerSidePerformance } from '../../blocks/server-side/performance/performance';
import FeaturesSection from '../../blocks/server-side/features-section';
import CustomerLogoMarqueeSection from '../../blocks/server-side/customer-logo-marquee';
import { Ecosystem } from '../../blocks/server-side/ecosystem/ecosystem';
import { HowToStart } from '../../blocks/server-side/how-to-start/how-to-start';
import { FavoriteTools } from '../../blocks/server-side/favorite-tools/favorite-tools';
import { AdditionalMaterials } from '../../blocks/server-side/additional-materials/additional-materials';
import { GetStarted } from '../../blocks/server-side/get-started/get-started';

import './styles.css';

const TOP_MENU_ITEMS = [
    {
        url: '/case-studies/?type=server-side',
        title: 'Success stories'
    }
];

function Index() {
    return (
        <LandingLayout
            title={'Kotlin for server-side'}
            ogImageName={'server-side.png'}
            description={
                'Build scalable server-side apps with Kotlin, from web backends to AI-powered services. Use Spring, Ktor, and the vast Java ecosystem'
            }
            currentTitle={SERVER_SIDE_TITLE}
            currentUrl={SERVER_SIDE_URL}
            topMenuTitle={SERVER_SIDE_TITLE}
            topMenuHomeUrl={SERVER_SIDE_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href={'#get-started'}>Get started</Button>}
        >
            <ServerSideHero />
            <CustomerLogoMarqueeSection />
            <FeaturesSection />
            <ServerSidePerformance />
            <Ecosystem />
            <HowToStart />
            <FavoriteTools />
            <AdditionalMaterials />
            <GetStarted />
        </LandingLayout>
    );
}

export default Index;
