import React from 'react';
import { LandingLayout } from '@/components/landing-layout/landing-layout';
import { Hero } from '@/blocks/state-of-kotlin-2026/hero/hero';
import { Questions } from '@/blocks/state-of-kotlin-2026/questions/questions';
import { Numbers } from '@/blocks/state-of-kotlin-2026/numbers/numbers';
import { Growth } from '@/blocks/state-of-kotlin-2026/growth/growth';
import { Organizations } from '@/blocks/state-of-kotlin-2026/organizations/organizations';
import { Backend } from '@/blocks/state-of-kotlin-2026/backend/backend';
import { Multiplatform } from '@/blocks/state-of-kotlin-2026/multiplatform/multiplatform';
import { Ai } from '@/blocks/state-of-kotlin-2026/ai/ai';
import { DownloadCta } from '@/blocks/state-of-kotlin-2026/download-cta/download-cta';
import { Faq } from '@/blocks/state-of-kotlin-2026/faq/faq';
import { Methodology } from '@/blocks/state-of-kotlin-2026/methodology/methodology';
import { HeroDecoration } from '@/blocks/state-of-kotlin-2026/hero-decoration/hero-decoration';
import { SectionNav } from '@/blocks/state-of-kotlin-2026/section-nav/section-nav';
import cn from 'classnames';

import styles from './index.module.css';

export const STATE_OF_KOTLIN_2026_TITLE = 'State of Kotlin 2026';
export const STATE_OF_KOTLIN_2026_URL = '/state-of-kotlin-2026/';

const TOP_MENU_ITEMS = [];

function Index() {
    return (
        <LandingLayout
            title="State of Kotlin 2026 | The Kotlin Report"
            description="15 years of Kotlin data: adoption, backend, multiplatform, and AI. Read the highlights and download the full State of Kotlin 2026 report."
            ogImageName={'state-of-kotlin-2026.png'}
            theme="light"
            hideTopMenu
            currentTitle={STATE_OF_KOTLIN_2026_TITLE}
            currentUrl={STATE_OF_KOTLIN_2026_URL}
            topMenuTitle={STATE_OF_KOTLIN_2026_TITLE}
            topMenuHomeUrl={STATE_OF_KOTLIN_2026_URL}
            topMenuItems={TOP_MENU_ITEMS}
            dataTestId={'state-of-kotlin-2026-page'}
        >
            <div className={styles.wrapper}>
                <HeroDecoration />
                <SectionNav />
                <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}>
                    <Hero />
                    <Questions />
                    <Numbers />
                    <Growth />
                    <Organizations />
                    <Backend />
                    <Multiplatform />
                    <Ai />
                    <DownloadCta />
                    <Faq />
                    <Methodology />
                </div>
            </div>
        </LandingLayout>
    );
}

export default Index;
