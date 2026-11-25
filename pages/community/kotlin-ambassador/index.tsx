import React from 'react';

import '@jetbrains/kotlin-web-site-ui/out/components/layout-v2';

import { COMMUNITY_URL } from '@jetbrains/kotlin-web-site-ui/out/components/header';
import { LandingLayout } from '@/components/landing-layout/landing-layout';
import { Hero } from '@/blocks/community/kotlin-ambassador/hero/hero';
import { Benefits } from '@/blocks/community/kotlin-ambassador/benefits/benefits';
import { Badge } from '@/blocks/community/kotlin-ambassador/badge/badge';
import { Links } from '@/blocks/community/kotlin-ambassador/links/links';

import styles from './index.module.css';

function Index() {
    return (
        <LandingLayout
            title={'Kotlin Ambassadors Program'}
            description="You’re invited to become a Kotlin Ambassador."
            theme="light"
            hideTopMenu
            currentUrl={COMMUNITY_URL}
            noindex
        >
            <div className={styles.page} data-testid="kotlin-ambassador-content">
                <Hero />
                <div className={styles.programSection} data-testid="kotlin-ambassador-program-section">
                    <Benefits />
                    <Badge />
                </div>
                <Links />
            </div>
        </LandingLayout>
    );
}

export default Index;
