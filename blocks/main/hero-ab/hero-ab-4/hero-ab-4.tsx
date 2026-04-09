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
import KotlinIcon from '@/blocks/main/hero-ab/images/icons/kotlin-icon-4.svg';
import { Button } from '@rescui/button';

interface Props {
}

export const HeroSectionAB4: FC<Props> = ({}) => {
    const darkTextCn = createTextCn('dark');

    return (
        <ThemeProvider theme={'dark'}>
            <HeroLayout testId={'hero-block-ab-4'}>
                <div className={styles.wrapper}>
                    <div className={styles.heading}>
                        <h1 className={cn(darkTextCn('rs-middle-hero'), styles.heroText)}>Kotlin</h1>
                        <p className={cn(darkTextCn('rs-subtitle-1'), styles.subtitle)}>Concise. Multiplatform. Fun.</p>

                        <Developer />
                    </div>

                    <div className={styles.navItems}>
                        <a className={styles.navItem} href={'/multiplatform/'}>
                            <img src={KMPIcon.src} className={styles.icon} alt={`KMP icon`} />
                            <h3 className={cn(darkTextCn('rs-h3'), styles.title)}>Multiplatform</h3>
                            <p className={cn(darkTextCn('rs-text-2'), styles.text)}>
                                Go cross‑platform without compromising performance, UX, or code quality.
                            </p>
                        </a>
                        <a className={styles.navItem} href={'/docs/kotlin-ai-apps-development-overview.html'}>
                            <img src={AIIcon.src} className={styles.icon} alt={`AI icon`} />
                            <h3 className={cn(darkTextCn('rs-h3'), styles.title)}>AI development</h3>
                            <p className={cn(darkTextCn('rs-text-2'), styles.text)}>
                                Leverage AI models tailored for Kotlin, backed by JetBrains' open data, benchmarks, and
                                tooling built into your workflow.
                            </p>
                        </a>
                        <a className={styles.navItem} href={'/server-side/'}>
                            <img src={BackendIcon.src} className={styles.icon} alt={`Backend icon`} />
                            <h3 className={cn(darkTextCn('rs-h3'), styles.title)}>Backend</h3>
                            <p className={cn(darkTextCn('rs-text-2'), styles.text)}>
                                Build fast applications with Spring or Ktor. Kotlin's expressiveness makes backend code
                                a pleasure to write and maintain.
                            </p>
                        </a>
                        <a className={styles.navItem} href={'/docs/android-overview.html'}>
                            <img src={AndroidIcon.src} className={styles.icon} alt={`Android icon`} />
                            <h3 className={cn(darkTextCn('rs-h3'), styles.title)}>Android</h3>
                            <p className={cn(darkTextCn('rs-text-2'), styles.text)}>
                                Write less boilerplate, ship more features with the official language of Android
                                development since 2019.
                            </p>
                        </a>

                        <a className={styles.navItem} href={'/docs/kotlin-tour-welcome.html'}>
                            <div className={styles.kotlinTour}>
                                <img src={KotlinIcon.src} className={styles.kotlinIcon} alt={`Kotlin icon`} />
                                <h3 className={darkTextCn('rs-h3')}>Kotlin Tour</h3>
                                <Button size="m" mode={'outline'} className={styles.quickStartButton}>
                                    Quick Start
                                </Button>
                            </div>
                        </a>
                    </div>

                    <Playground />
                </div>
            </HeroLayout>
        </ThemeProvider>
    );
};
