import React from 'react';

import '@jetbrains/kotlin-web-site-ui/out/components/layout-v2';

import { CommunityLayout } from '@/blocks/community/layout/community-layout';
import { Hero } from '@/blocks/community/ambassadors/hero/hero';
import { WhoCanBecome } from '@/blocks/community/ambassadors/who-can-become/who-can-become';
import { HowToBecome } from '@/blocks/community/ambassadors/how-to-become/how-to-become';
import { Faq } from '@/blocks/community/ambassadors/faq/faq';

import styles from './index.module.css';

function Index() {
    return (
        <CommunityLayout
            title={'Kotlin Ambassadors Program'}
            description="A program for creators, educators, and community leaders making a lasting impact on the Kotlin ecosystem."
            ogImageName="general.png"
        >
            <div className={styles.page} data-testid="ambassadors-content">
                <Hero />
                <div className={styles.programSection} data-testid="ambassadors-program-section">
                    <WhoCanBecome />
                    <HowToBecome />
                </div>
                <Faq />
            </div>
        </CommunityLayout>
    );
}

export default Index;
