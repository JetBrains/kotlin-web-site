import React from 'react';
import { Button } from '@rescui/button';
import { CASE_STUDIES_TITLE, CASE_STUDIES_URL } from '@jetbrains/kotlin-web-site-ui/out/components/header';
import { LandingLayout } from '../../components/landing-layout/landing-layout';
import { CaseStudiesHero } from '../../blocks/case-studies/hero/case-studies-hero';
import { CaseStudiesFilter } from '../../blocks/case-studies/filter/case-studies-filter';
import { CaseStudiesGrid } from '../../blocks/case-studies/grid/case-studies-grid';
import { RouterCasesProvider } from '../../blocks/case-studies/filter/use-filtered-cases';

const TOP_MENU_ITEMS = [
    {
        url: '/case-studies/',
        title: 'Success stories'
    }
];

function Index() {
    return (
        <LandingLayout
            title="Kotlin Case Studies | Mobile, Web & Server-side"
            ogImageName={'case-studies.png'}
            description="Discover how teams use Kotlin to build backend services, multiplatform apps, and modern UIs. Explore real-world case studies and success stories."
            currentTitle={CASE_STUDIES_TITLE}
            currentUrl={CASE_STUDIES_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href="https://kotlinlang.org/docs/getting-started.html">Get started</Button>}
            dataTestId={'case-studies-page'}
            canonical={'https://kotlinlang.org/case-studies/'}
        >
            <CaseStudiesHero />
            <CaseStudiesFilter />
            <RouterCasesProvider>
                <CaseStudiesGrid />
            </RouterCasesProvider>
        </LandingLayout>
    );
}

export default Index;
