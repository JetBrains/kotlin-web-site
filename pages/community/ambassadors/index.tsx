import React from 'react';

import { LandingLayout } from '@/components/landing-layout/landing-layout';
import { Hero } from '@/blocks/community/ambassadors/hero/hero';
import { WhoCanBecome } from '@/blocks/community/ambassadors/who-can-become/who-can-become';
import { HowToBecome } from '@/blocks/community/ambassadors/how-to-become/how-to-become';
import { Faq } from '@/blocks/community/ambassadors/faq/faq';

import styles from './index.module.css';

export const AMBASSADORS_TITLE = 'Kotlin Ambassadors Program';
export const AMBASSADORS_URL = '/community/ambassadors/';

function Index() {
    return (
        <LandingLayout
            title={AMBASSADORS_TITLE}
            description="A program for creators, educators, and community leaders making a lasting impact on the Kotlin ecosystem."
            theme="light"
            hideTopMenu
            ogImageName="general.png"
            dataTestId="ambassadors-page"
        >
            <div className={styles.page} data-testid="ambassadors-content">
                <Hero />
                <div className={styles.programSection} data-testid="ambassadors-program-section">
                    <WhoCanBecome />
                    <HowToBecome />
                </div>
                <Faq />
            </div>
        </LandingLayout>
    );
}

export default Index;
