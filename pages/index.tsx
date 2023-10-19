import React from 'react';
import GlobalHeader from '@jetbrains/kotlin-web-site-ui/out/components/header';
import searchConfig from '../search-config.json';

import { HeroSection } from '../blocks/main/hero/hero';
import { WhyKotlin } from '../blocks/main/why-kotlin/why-kotlin';

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
            <WhyKotlin />
        </>
    );
}

export default Index;
