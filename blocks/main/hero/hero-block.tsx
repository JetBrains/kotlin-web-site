import React, { FC } from 'react';
import cn from 'classnames';
import { ArrowRightIcon } from '@rescui/icons';

import { createTextCn } from '@rescui/typography';

import styles from './hero-block.module.css';

import { HeroLayout } from './components/layout/layout';
import { Developer } from './components/developer/developer';

import KMPIcon from './images/icons/multiplatform.svg';
import BackendIcon from './images/icons/backend.svg';
import AIIcon from './images/icons/ai.svg';
import AndroidIcon from './images/icons/android.svg';
import KotlinIcon from './images/icons/Kotlin.svg';
import { WhyKotlin } from '@/blocks/main/why-kotlin/why-kotlin';

interface Props {
}


export const HeroBlock: FC<Props> = ({}) => {
    const darkTextCn = createTextCn('dark');

    return (
        <HeroLayout>
            <div className={styles.grid}>
                <div className={styles.heading}>
                    <h1 className={cn(darkTextCn('rs-super-hero'), styles.heroText)}>Kotlin</h1>
                    <p className={cn(darkTextCn('rs-subtitle-1'), styles.subtitle)}>Concise. Multiplatform. Fun.</p>

                    <Developer />
                </div>

                <div className={styles.navItems}>
                    <a className={styles.navItem} href={'/multiplatform/'}>
                        <img src={KMPIcon.src} className={cn(styles.navIcon, styles.navIconKmp)} alt={`KMP icon`} />
                        <p className={darkTextCn('rs-text-2')}>Multiplatform</p>
                        <ArrowRightIcon className={styles.navArrow} />
                    </a>
                    <a className={styles.navItem} href={'/server-side/'}>
                        <img src={BackendIcon.src} className={styles.navIcon} alt={`Backend icon`} />
                        <p className={darkTextCn('rs-text-2')}>Backend</p>
                        <ArrowRightIcon className={styles.navArrow} />
                    </a>
                    <a className={styles.navItem} href={'/docs/kotlin-ai-apps-development-overview.html'}>
                        <img src={AIIcon.src} className={styles.navIcon} alt={`AI icon`} />
                        <p className={darkTextCn('rs-text-2')}>AI</p>
                        <ArrowRightIcon className={styles.navArrow} />
                    </a>
                    <a className={styles.navItem} href={'/docs/android-overview.html'}>
                        <img src={AndroidIcon.src} className={styles.navIcon} alt={`Android icon`} />
                        <p className={darkTextCn('rs-text-2')}>Android</p>
                        <ArrowRightIcon className={styles.navArrow} />
                    </a>
                    <a className={styles.navItem} href={'/docs/kotlin-tour-welcome.html'}>
                        <img src={KotlinIcon.src} className={styles.navIcon} alt={`Kotlin icon`} />
                        <p className={darkTextCn('rs-text-2')}>Kotlin tour</p>
                        <ArrowRightIcon className={styles.navArrow} />
                    </a>
                </div>
            </div>

            <WhyKotlin />

        </HeroLayout>
    );
};
