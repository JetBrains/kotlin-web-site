import React, { FC } from 'react';
import cn from 'classnames';
import { ArrowRightIcon } from '@rescui/icons';

import { createTextCn } from '@rescui/typography';

import styles from './hero-ab-2.module.css';

import { HeroLayout } from '../components/layout/layout';
import { Developer } from '../components/developer/developer';
import { Playground } from '../components/playground/playground';

import KMPIcon from '@/blocks/main/hero-ab/images/icons/multiplatform.svg';
import BackendIcon from '@/blocks/main/hero-ab/images/icons/backend.svg';
import AIIcon from '@/blocks/main/hero-ab/images/icons/ai.svg';
import AndroidIcon from '@/blocks/main/hero-ab/images/icons/android.svg';
import KotlinIcon from '@/blocks/main/hero-ab/images/icons/Kotlin.svg';

interface Props {
}


export const HeroSectionAB2: FC<Props> = ({}) => {
    const darkTextCn = createTextCn('dark');

    return (
        <HeroLayout testId={'hero-block-ab-2'}>

            <div className={styles.grid}>
                <div className={styles.heading}>
                    <h1 className={cn(darkTextCn('rs-super-hero'), styles.heroText)}>Kotlin</h1>
                    <p className={cn(darkTextCn('rs-subtitle-1'), styles.subtitle)}>Concise. Multiplatform.
                        Fun.</p>

                    <Developer />
                </div>

                <div className={styles.navItems}>
                    <a className={styles.navItem} href={'/'}>
                        <img src={KMPIcon.src} className={styles.navIcon} alt={`KMP icon`} />
                        <p className={darkTextCn('rs-text-2')}>Multiplatform</p>
                        <ArrowRightIcon className={styles.navArrow} />
                    </a>
                    <a className={styles.navItem} href={'/'}>
                        <img src={BackendIcon.src} className={styles.navIcon} alt={`Backend icon`} />
                        <p className={darkTextCn('rs-text-2')}>Backend</p>
                        <ArrowRightIcon className={styles.navArrow} />
                    </a>
                    <a className={styles.navItem} href={'/'}>
                        <img src={AIIcon.src} className={styles.navIcon} alt={`AI icon`} />
                        <p className={darkTextCn('rs-text-2')}>AI</p>
                        <ArrowRightIcon className={styles.navArrow} />
                    </a>
                    <a className={styles.navItem} href={'/'}>
                        <img src={AndroidIcon.src} className={styles.navIcon} alt={`Android icon`} />
                        <p className={darkTextCn('rs-text-2')}>Android</p>
                        <ArrowRightIcon className={styles.navArrow} />
                    </a>
                    <a className={styles.navItem} href={'/'}>
                        <img src={KotlinIcon.src} className={styles.navIcon} alt={`Kotlin icon`} />
                        <p className={darkTextCn('rs-text-2')}>Kotlin tour</p>
                        <ArrowRightIcon className={styles.navArrow} />
                    </a>
                </div>
            </div>

            <Playground />

        </HeroLayout>
    );
};
