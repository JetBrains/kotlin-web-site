import React, { FC, ReactNode } from 'react';
import Button from '@rescui/button';
import cn from 'classnames';

import { useTextStyles, createTextCn } from '@rescui/typography';
import { ThemeProvider } from '@rescui/ui-contexts';
import  heroBannerDataRaw from '../../../data/hero-banner.yml';

import Image from 'next/image';

import '@jetbrains/kotlin-web-site-ui/out/components/layout';

import styles from './hero.module.css';

import JBLogo from '../../../assets/jetbrains-logo.svg';
import HeroImg from './images/hero-cover.png';
import HeroImg2x from './images/hero-cover@2x.png';

interface Props {
    title: string,
    children: ReactNode;
}

type HeroBannerData = {
    isActive: boolean;
    title: string;
    caption: string;
    buttonLabel: string;
    buttonUrl: string;
}

const heroBannerData = heroBannerDataRaw as HeroBannerData;

export const HeroSection: FC<Props> = ({ children, title }) => {
    const textCn = useTextStyles();
    const darkTextCn = createTextCn('dark');

    return (
        <ThemeProvider theme={'dark'}>
            <section className={cn(styles.heroSection)}>
                <div className={cn('ktl-layout', 'ktl-layout--center', 'hero-b')}>
                    <div className={styles.grid}>
                        <div className={styles.content}>
                            <h1 className={cn(darkTextCn('rs-hero'), styles.heroText)}>{title}</h1>
                            <p className={cn(darkTextCn('rs-subtitle-2'), styles.subtitle)}>{children}</p>

                            <Image src={HeroImg} alt={"kotlin"} className={styles.imageMobile} />

                            <div className={styles.info}>
                                <Button size={'l'} href="/docs/getting-started.html" className={styles.getStartedButton}>
                                    Get started
                                </Button>
                                <div className={styles.developer}>
                                    <div className={styles.developerContent}>
                                        <div className={cn(darkTextCn('rs-text-2', { hardness: 'hard' }), styles.developerCaption)}>Developed by</div>
                                        <a
                                            href="https://www.jetbrains.com/"
                                            target={'_blank'}
                                            rel={'noreferrer noopener'}
                                        >
                                            <img src={JBLogo.src} alt="jetbrains logo" className={styles.developerLogo} />{' '}
                                        </a>
                                    </div>
                                </div>
                                {heroBannerData.isActive && <div className={styles.banner}>
                                    <div className={styles.bannerContent}>
                                        <h5 className={cn(darkTextCn('rs-h2'), styles.bannerTitle)}>{heroBannerData.title}</h5>
                                        <p className={cn(darkTextCn('rs-text-2'), styles.bannerCaption)}>{heroBannerData.caption}</p>
                                    </div>
                                    <Button mode="outline" size="m" href={heroBannerData.buttonUrl}
                                            className={styles.bannerButton}>{heroBannerData.buttonLabel}</Button>
                                </div>}
                            </div>
                        </div>

                        <img
                            className={styles.imageDesktop}
                            src={HeroImg.src}
                            srcSet={`${HeroImg2x.src} 2x`}
                            alt="kotlin"
                            height="560"
                            width="560"
                        />
                    </div>
                </div>
            </section>
        </ThemeProvider>
    );
};
