import React from 'react';
import { Button } from '@rescui/button';

import { LandingLayout } from '@/components/landing-layout/landing-layout';

import styles from './index.module.css';
import { TermsConditionsBlock } from '@/blocks/kotlin-effect/terms-conditions-block/terms-conditions-block';
import cn from 'classnames';

export const KOTLIN_EFFECT_TITLE = 'Kotlin Effect';
export const KOTLIN_EFFECT_URL = '/kotlin-effect/';

const TOP_MENU_ITEMS = [];

function Terms() {
    return (
        <LandingLayout
            title="The Kotlin Effect | Write Less. Do More."
            ogImageName={'kotlin-effect.jpg'}
            description="Discover the Kotlin Effect. Write less code, do more, and enjoy the process. Watch the video, play the game, and explore learning resources."
            currentTitle={KOTLIN_EFFECT_TITLE}
            currentUrl={KOTLIN_EFFECT_URL}
            topMenuTitle={KOTLIN_EFFECT_TITLE}
            topMenuHomeUrl={KOTLIN_EFFECT_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href="https://play.kotlinlang.org/">Try Kotlin</Button>}
            dataTestId={'kotlin-effect-page'}
        >
            <div className={styles.wrapper}>
                <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.layout)}>
                    <TermsConditionsBlock />
                </div>
            </div>
        </LandingLayout>
    );
}

export default Terms;
