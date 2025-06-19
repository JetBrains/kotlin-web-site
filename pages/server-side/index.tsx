import React from 'react';
import { ServerSideLayout } from '../../blocks/server-side/layout/server-side-layout';

function Index() {
    return (
        <ServerSideLayout title={'Server Side'} ogImageName={'community.png'}>
            <h1>Server side</h1>
        </ServerSideLayout>
    );
}

export default Index;
