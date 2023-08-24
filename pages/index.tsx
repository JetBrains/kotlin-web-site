import React from 'react';
import GlobalHeader from '@jetbrains/kotlin-web-site-ui/out/components/header';
import searchConfig from '../search-config.json';

function Index() {
    return (
        <>
            <GlobalHeader productWebUrl={''} hasSearch={true} searchConfig={searchConfig} />
        </>
    );
}

export default Index;
