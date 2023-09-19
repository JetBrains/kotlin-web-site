import React from 'react';
import GlobalHeader from '@jetbrains/kotlin-web-site-ui/out/components/header';
import searchConfig from '../search-config.json';

import { HeroSection } from '../blocks/front-page/hero/hero';

function Index() {
    return (
        <>
            <GlobalHeader productWebUrl={''} hasSearch={true} searchConfig={searchConfig} darkHeader />
            <HeroSection>
                <>
                    Concise.
                    <br /> Multiplatform.
                    <br /> Fun.
                </>
            </HeroSection>
        </>
    );
}

export default Index;
