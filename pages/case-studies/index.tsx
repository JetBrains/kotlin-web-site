import React from 'react';
import { ServerSideLayout } from '../../blocks/server-side/layout/server-side-layout';
import { CaseStudiesHero } from '../../blocks/case-studies/hero/case-studies-hero';
import { CaseStudiesFilter } from '../../blocks/case-studies/filter/case-studies-filter';
import { CaseStudiesGrid } from '../../blocks/case-studies/grid/case-studies-grid';

function Index() {
    return (
        <ServerSideLayout title={'Case Studies'} ogImageName={'case-studies.png'}>
            <CaseStudiesHero />
            <CaseStudiesFilter />
            <CaseStudiesGrid />
        </ServerSideLayout>
    );
}

export default Index;
