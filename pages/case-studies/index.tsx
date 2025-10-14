import React from 'react';
import { ServerSideLayout } from '../../blocks/server-side/layout/server-side-layout';
import { CaseStudiesHero } from '../../blocks/case-studies/hero/case-studies-hero';
import { CaseStudiesFilter } from '../../blocks/case-studies/filter/case-studies-filter';
import { CaseStudiesGrid } from '../../blocks/case-studies/grid/case-studies-grid';

function Index() {
    return (
        <ServerSideLayout
            title="Kotlin Case Studies | Mobile, Web & Server-side"
            ogImageName={'case-studies.png'}
            description="Discover how teams use Kotlin to build backend services, multiplatform apps, and modern UIs. Explore real-world case studies and success stories."
        >
            <CaseStudiesHero />
            <CaseStudiesFilter />
            <CaseStudiesGrid />
        </ServerSideLayout>
    );
}

export default Index;
