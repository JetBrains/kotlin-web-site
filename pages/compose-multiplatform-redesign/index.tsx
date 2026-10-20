import React from 'react';
import cn from 'classnames';

import { LandingLayout } from '@/components/landing-layout/landing-layout';
import { HeroSection } from '@/blocks/compose-multiplatform-redesign/hero/hero';
import { AndroidSkillsEverySection } from '@/blocks/compose-multiplatform-redesign/android-skills-every/android-skills-every';
import { NativeExperiencesSection } from '@/blocks/compose-multiplatform-redesign/native-experiences/native-experiences';
import { SupportedPlatformsSection } from '@/blocks/compose-multiplatform-redesign/supported-platforms/supported-platforms';
import { TryComposeMultiplatformSection } from '@/blocks/compose-multiplatform-redesign/try-compose-multiplatform/try-compose-multiplatform';
import { AlexAskerovSection } from '@/blocks/compose-multiplatform-redesign/alex-askerov/alex-askerov';
import { FaqSection } from '@/blocks/compose-multiplatform-redesign/faq/faq';
import { BuildYourFirstSection } from '@/blocks/compose-multiplatform-redesign/build-your-first/build-your-first';

import styles from './index.module.css';

// The blocks in the mock's order (.f2c/pages/compose-multiplatform-redesign/manifest.json). The shell is
// the newest shipped landing's (pages/state-of-kotlin-2026, rules R1):
// LandingLayout carries header, meta and footer and takes the page's theme as
// a prop; the layout column is ktl-layout-v2; every block owns its vertical
// padding (rules R2) — nothing is spaced here.
export const PAGE_TITLE = 'Compose Multiplatform | Kotlin AI Pages (KTL-5170 / KTL-4742)';
export const PAGE_URL = '/compose-multiplatform-redesign/';

function ComposeMultiplatformRedesignOverviewPage() {
    return (
        <LandingLayout
            title={PAGE_TITLE}
            description={'TODO: meta description verbatim from the brief'}
            theme="dark"
            hideTopMenu
            currentTitle={PAGE_TITLE}
            currentUrl={PAGE_URL}
            dataTestId="compose-multiplatform-redesign-page"
        >
            <div className={styles.wrapper}>
                <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}>
                    <HeroSection />
                    <AndroidSkillsEverySection />
                    <NativeExperiencesSection />
                    <SupportedPlatformsSection />
                    <TryComposeMultiplatformSection />
                    <AlexAskerovSection />
                    <FaqSection />
                    <BuildYourFirstSection />
                </div>
            </div>
        </LandingLayout>
    );
}

export default ComposeMultiplatformRedesignOverviewPage;
