import React from 'react';
import { Button } from '@rescui/button';

import { LandingLayout, LandingLayoutProps } from '@/components/landing-layout/landing-layout';
import { CONTACT_TEAM_URL, KOTLIN_LTS_TITLE, KOTLIN_LTS_URL, SECTION_IDS } from '@/blocks/kotlin-lts/constants';
import { Hero } from '@/blocks/kotlin-lts/hero/hero';
import { Coverage } from '@/blocks/kotlin-lts/coverage/coverage';
import { Benefits } from '@/blocks/kotlin-lts/benefits/benefits';
import { PatchInPlace } from '@/blocks/kotlin-lts/patch-in-place/patch-in-place';
import { Cta } from '@/blocks/kotlin-lts/cta/cta';
import { Newsletter } from '@/blocks/kotlin-lts/newsletter/newsletter';
import { Constraints } from '@/blocks/kotlin-lts/constraints/constraints';
import { Faq } from '@/blocks/kotlin-lts/faq/faq';

const TOP_MENU_ITEMS: LandingLayoutProps['topMenuItems'] = [
    { title: 'Coverage', url: `#${SECTION_IDS.coverage}` },
    { title: 'How it works', url: `#${SECTION_IDS.how}` },
    { title: 'FAQ', url: `#${SECTION_IDS.faq}` },
];

export default function KotlinLtsLanding() {
    return (
        <LandingLayout
            dataTestId="kotlin-lts-landing"
            title="Kotlin Targeted Security Patches"
            description="Targeted security patches for agreed components and release lines of your Kotlin stack. Discuss coverage and commercial support with the Kotlin team."
            theme="light"
            footerTheme="light"
            topMenuTitle={KOTLIN_LTS_TITLE}
            topMenuHomeUrl={KOTLIN_LTS_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href={CONTACT_TEAM_URL}>Contact team</Button>}
        >
            <main className="ktl-layout-to-2">
                <Hero />
                <Newsletter />
                <Constraints />
                <Benefits />
                <Coverage />
                <PatchInPlace />
                <Faq />
                <Cta />
            </main>
        </LandingLayout>
    );
}
