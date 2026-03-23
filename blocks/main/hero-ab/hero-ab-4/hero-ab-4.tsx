import React, { FC } from 'react';
import cn from 'classnames';

import { createTextCn } from '@rescui/typography';
import { ThemeProvider } from '@rescui/ui-contexts';

import styles from './hero-ab-4.module.css';
import { HeroLayout } from '../components/layout/layout';

import { Developer } from '../components/developer/developer';
import { Playground } from '../components/playground/playground';

import KMPIcon from '@/blocks/main/hero-ab/images/icons/multiplatform.svg';
import BackendIcon from '@/blocks/main/hero-ab/images/icons/backend.svg';
import AIIcon from '@/blocks/main/hero-ab/images/icons/ai.svg';
import AndroidIcon from '@/blocks/main/hero-ab/images/icons/android.svg';
import KotlinIcon from '@/blocks/main/hero-ab/images/icons/Kotlin.svg';
import { Button } from '@rescui/button';

interface Props {
}

export const HeroSectionAB4: FC<Props> = ({}) => {
    const darkTextCn = createTextCn('dark');

    return (
        <ThemeProvider theme={'dark'}>
            <HeroLayout>
                <div className={styles.wrapper}>
                    <div className={styles.heading}>
                        <h1 className={cn(darkTextCn('rs-middle-hero'), styles.heroText)}>Kotlin</h1>
                        <p className={cn(darkTextCn('rs-subtitle-1'), styles.subtitle)}>Concise. Multiplatform.
                            Fun.</p>

                        <Developer />
                    </div>

                    <div className={styles.navItems}>
                        <a className={styles.navItem} href={'/'}>
                            <img src={KMPIcon.src} className={styles.icon} alt={`KMP icon`} />
                            <h3 className={cn(darkTextCn('rs-h3'), styles.title)}>Multiplatform</h3>
                            <p className={cn(darkTextCn('rs-text-2'), styles.text)}>
                                Build modern Android applications using Kotlin and the official Android toolkit.
                            </p>
                        </a>
                        <a className={styles.navItem} href={'/'}>
                            <img src={AIIcon.src} className={styles.icon} alt={`AI icon`} />
                            <h3 className={cn(darkTextCn('rs-h3'), styles.title)}>AI development</h3>
                            <p className={cn(darkTextCn('rs-text-2'), styles.text)}>
                                Share code across Android, iOS, web, and desktop using Kotlin Multiplatform.
                            </p>
                        </a>
                        <a className={styles.navItem} href={'/'}>
                            <img src={BackendIcon.src} className={styles.icon} alt={`Backend icon`} />
                            <h3 className={cn(darkTextCn('rs-h3'), styles.title)}>Backend</h3>
                            <p className={cn(darkTextCn('rs-text-2'), styles.text)}>
                                Develop scalable server-side applications and APIs with Kotlin on the JVM.
                            </p>
                        </a>
                        <a className={styles.navItem} href={'/'}>
                            <img src={AndroidIcon.src} className={styles.icon} alt={`Android icon`} />
                            <h3 className={cn(darkTextCn('rs-h3'), styles.title)}>Android</h3>
                            <p className={cn(darkTextCn('rs-text-2'), styles.text)}>
                                Leverage Kotlin for machine learning, data processing, and AI-driven applications.
                            </p>
                        </a>

                        <a className={styles.navItem} href={'/'}>
                            <div className={styles.kotlinTour}>
                                <img src={KotlinIcon.src} className={styles.kotlinIcon} alt={`Kotlin icon`} />
                                <h3 className={darkTextCn('rs-h3')}>Kotlin Tour</h3>
                                <Button size="m" mode={'outline'} className={styles.quickStartButton}>Quick Start</Button>
                            </div>
                        </a>

                    </div>

                    <Playground />

                </div>
            </HeroLayout>
        </ThemeProvider>
    );
};
