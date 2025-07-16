import React from 'react';
import { ServerSideLayout } from '../../blocks/server-side/layout/server-side-layout';
import { ServerSideHero } from '../../blocks/server-side/hero/hero';
import { ServerSidePerformance } from '../../blocks/server-side/performance/performance';

function Index() {
    return (
        <ServerSideLayout title={'Server Side'} ogImageName={'community.png'}>
            <ServerSideHero />
            <ServerSidePerformance />
        </ServerSideLayout>
    );
}

export default Index;
