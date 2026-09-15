import React from 'react';
import { Button } from '@rescui/button';
import { BACKEND_TITLE, BACKEND_URL } from '@jetbrains/kotlin-web-site-ui/out/components/header';
import { LandingLayout } from '../../components/landing-layout/landing-layout';
import { ServerSideHero } from '../../blocks/server-side/hero/hero';
import { ServerSidePerformance } from '../../blocks/server-side/performance/performance';
import FeaturesSection from '../../blocks/server-side/features-section';
import CustomerLogoMarqueeSection from '../../components/customer-logo-marquee';
import { Ecosystem } from '../../blocks/server-side/ecosystem/ecosystem';
import { HowToStart } from '../../blocks/server-side/how-to-start/how-to-start';
import { FavoriteTools } from '../../blocks/server-side/favorite-tools/favorite-tools';
import { AdditionalMaterials } from '../../blocks/server-side/additional-materials/additional-materials';
import { GetStartedServerSide } from '../../blocks/server-side/get-started/get-started';

import logos from '../../components/customer-logo-marquee/server-side-logos';

import './styles.css';

const TOP_MENU_ITEMS = [
    {
        url: '/case-studies/?type=backend',
        title: 'Success stories'
    }
];

function Index() {
    return (
        <LandingLayout
            title={'Kotlin for Backend'}
            ogImageName={'server-side.png'}
            description={
                'Build scalable backend apps with Kotlin, from web backends to AI-powered services. Use Spring, Ktor, and the vast Java ecosystem'
            }
            currentTitle={BACKEND_TITLE}
            currentUrl={BACKEND_URL}
            topMenuTitle={BACKEND_TITLE}
            topMenuHomeUrl={BACKEND_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href={'#get-started'}>Get started</Button>}
            dataTestId={'server-side-page'}
        >
            <ServerSideHero />
            <CustomerLogoMarqueeSection items={logos} />
            <FeaturesSection />
            <ServerSidePerformance />
            <Ecosystem />
            <HowToStart />
            <FavoriteTools />
            <AdditionalMaterials />
            <GetStartedServerSide />
        </LandingLayout>
    );
}

export default Index;
