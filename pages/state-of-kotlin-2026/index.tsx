import React from 'react';
import { LandingLayout } from '@/components/landing-layout/landing-layout';
import { Hero } from '@/blocks/state-of-kotlin-2026/hero/hero';
import { SectionNav } from '@/blocks/state-of-kotlin-2026/section-nav/section-nav';

import cn from 'classnames';

import styles from './index.module.css';

export const STATE_OF_KOTLIN_2026_TITLE = 'State of Kotlin 2026';
export const STATE_OF_KOTLIN_2026_URL = '/state-of-kotlin-2026/';

function Index() {
    return (
        <LandingLayout
            title="State of Kotlin 2026 | The Kotlin Report"
            description="15 years of Kotlin data: adoption, backend, multiplatform, and AI. Read the highlights and download the full State of Kotlin 2026 report."
            theme="light"
            hideTopMenu
            currentTitle={STATE_OF_KOTLIN_2026_TITLE}
            currentUrl={STATE_OF_KOTLIN_2026_URL}
            ogImageName={'state-of-kotlin-2026.jpg'}
            dataTestId={'state-of-kotlin-2026-page'}
        >
            <div className={styles.wrapper}>
                <SectionNav />
                <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}>
                    <Hero />
                </div>
            </div>
        </LandingLayout>
    );
}

export default Index;
