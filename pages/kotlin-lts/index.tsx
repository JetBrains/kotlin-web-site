import React from 'react';
import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';

import { LandingLayout, LandingLayoutProps } from '@/components/landing-layout/landing-layout';
import { CONTACT_SALES_URL, KOTLIN_LTS_TITLE, KOTLIN_LTS_URL, SECTION_IDS } from '@/blocks/kotlin-lts/constants';
import { Hero } from '@/blocks/kotlin-lts/hero/hero';
import { Coverage } from '@/blocks/kotlin-lts/coverage/coverage';
import { Benefits } from '@/blocks/kotlin-lts/benefits/benefits';
import { PatchInPlace } from '@/blocks/kotlin-lts/patch-in-place/patch-in-place';
import { Cta } from '@/blocks/kotlin-lts/cta/cta';

const TOP_MENU_ITEMS: LandingLayoutProps['topMenuItems'] = [
    { title: 'Coverage', url: `#${SECTION_IDS.coverage}` },
    { title: "What's included", url: `#${SECTION_IDS.benefits}` },
    { title: 'How it works', url: `#${SECTION_IDS.how}` }
];

export default function KotlinLtsLanding() {
    return (
        <LandingLayout
            dataTestId="kotlin-lts-landing"
            title="Kotlin Long-Term Support"
            description="Keep your Kotlin stack secure and reliable with targeted patch updates – minimize upgrade effort."
            topMenuTitle={KOTLIN_LTS_TITLE}
            topMenuHomeUrl={KOTLIN_LTS_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href={CONTACT_SALES_URL}>Contact sales</Button>}
        >
            <div className="ktl-layout-to-2">
                <Hero />

                <ThemeProvider theme="light">
                    <Coverage />
                    <Benefits />
                    <PatchInPlace />
                </ThemeProvider>

                <Cta />
            </div>
        </LandingLayout>
    );
}
