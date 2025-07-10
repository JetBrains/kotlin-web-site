import React from 'react';
import { ServerSideLayout } from '../../blocks/server-side/layout/server-side-layout';
import FeaturesSection from '../../blocks/server-side/features-section';

function Index() {
    return (
        <ServerSideLayout title={'Server Side'} ogImageName={'community.png'}>
            <h1>Server side</h1>

            <FeaturesSection />
        </ServerSideLayout>
    );
}

export default Index;
