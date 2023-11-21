import React, { FC, ReactNode } from 'react';
import Button from '@rescui/button';
import cn from 'classnames';

import { useTextStyles, createTextCn } from '@rescui/typography';
import { ThemeProvider } from '@rescui/ui-contexts';

import '@jetbrains/kotlin-web-site-ui/out/components/layout';

import styles from './hero.module.css';

import JBLogo from '../../../assets/jetbrains-logo.svg';
import HeroImg from './images/hero-cover.png';
import HeroImg2x from './images/hero-cover@2x.png';

interface Props {
    children: ReactNode;
}

export const HeroSection: FC<Props> = ({ children }) => {
    const textCn = useTextStyles();
    const darkTextCn = createTextCn('dark');

    return (
        <ThemeProvider theme={'dark'}>
            <section className={styles.heroSection}>
                <div className={cn('ktl-layout', 'ktl-layout--center')}>
                    <div className={styles.grid}>
                        <div className={styles.content}>
                            <h1 className={cn(darkTextCn('rs-hero'), styles.heroText)}>{children}</h1>

                            <img
                                className={styles.imageMobile}
                                src={HeroImg.src}
                                srcSet={`${HeroImg2x.src} 2x`}
                                alt="kotlin"
                            />

                            <div className={styles.info}>
                                <Button size={'l'} href="/docs/getting-started.html" className={styles.getStartedButton}>
                                    Get started
                                </Button>
                                <div className={styles.developer}>
                                    <img src={JBLogo.src} alt="jetbrains logo" className={styles.developerLogo} />{' '}
                                    <div className={darkTextCn('rs-text-3', { hardness: 'hard' })}>
                                        Kotlin, developed by&nbsp;
                                        <a
                                            href="https://www.jetbrains.com/"
                                            className={darkTextCn('rs-link', { hardness: 'hard' })}
                                            target={'_blank'}
                                            rel={'noreferrer noopener'}
                                        >
                                            JetBrains
                                        </a>.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <img
                            className={styles.imageDesktop}
                            src={HeroImg.src}
                            srcSet={`${HeroImg2x.src} 2x`}
                            alt="kotlin"
                        />
                    </div>
                </div>
            </section>
        </ThemeProvider>
    );
};
