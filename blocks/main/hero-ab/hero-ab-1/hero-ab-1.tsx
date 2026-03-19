import React, { FC, ReactNode } from 'react';
import { Button } from '@rescui/button';
import cn from 'classnames';

import { createTextCn } from '@rescui/typography';
import { ThemeProvider } from '@rescui/ui-contexts';

import '@jetbrains/kotlin-web-site-ui/out/components/layout';

import styles from './hero-ab-1.module.css';

import JBLogo from '../../../../assets/jetbrains-logo.svg';
import { HeroPlatforms } from '../components/hero-platforms/hero-platforms';

import BGImage from '../images/hero-ab-bg.webp';

interface Props {
}

export const HeroSectionAB1: FC<Props> = ({}) => {
    const darkTextCn = createTextCn('dark');

    return (
        <ThemeProvider theme={'dark'}>
            <section className={cn(styles.heroSection)} data-testid={'hero-block-ab-1'}>
                <img className={styles.backgroundImg} src={BGImage.src} alt={'Hero Image'} />
                <div className={cn('ktl-layout', 'ktl-layout--center', 'hero-b')}>
                    <div className={styles.grid}>
                        <div className={styles.content}>
                            <h1 className={cn(darkTextCn('rs-super-hero'), styles.heroText)}>Kotlin</h1>
                            <p className={cn(darkTextCn('rs-subtitle-1'), styles.subtitle)}>Concise. Multiplatform.
                                Fun.</p>

                            <div className={styles.developer}>
                                <div className={styles.developerContent}>
                                    <div
                                        className={cn(darkTextCn('rs-text-2', { hardness: 'hard' }), styles.developerCaption)}>Developed
                                        by
                                    </div>
                                    <a
                                        href="https://www.jetbrains.com/"
                                        target={'_blank'}
                                        rel={'noreferrer noopener'}
                                    >
                                        <img src={JBLogo.src} alt="jetbrains logo"
                                             className={styles.developerLogo} />{' '}
                                    </a>
                                </div>
                            </div>


                            <div className={styles.heroPlatforms}>
                                <HeroPlatforms />
                            </div>

                            <div className={styles.kotlinTour}>
                                <div className={styles.kotlinTourTitle}>
                                    <h3 className={cn(darkTextCn('rs-h3'), styles.kotlinTourTitle)}>Start Kotlin tour</h3>
                                </div>
                                <div>
                                    <Button size='m' mode={'outline'}>Quick Start</Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </ThemeProvider>
    );
};
