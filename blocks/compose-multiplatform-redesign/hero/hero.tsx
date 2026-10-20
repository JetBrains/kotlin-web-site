import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';
import { presets, Tag } from '@rescui/tag';
import { AndroidIcon, AppleIcon, ComputerIcon, GlobusIcon } from '@rescui/icons';
import { useML } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import { CustomCarousel } from '../../../components/custom-carousel/custom-carousel';
import { HERO_GALLERY_ITEMS } from './hero-data';

import styles from './hero.module.css';

const PLATFORMS = [
    { id: 'android', title: 'Android', Icon: AndroidIcon },
    { id: 'ios', title: 'iOS', Icon: AppleIcon },
    { id: 'web', title: 'Web', Icon: GlobusIcon },
    { id: 'desktop', title: 'Desktop', Icon: ComputerIcon },
];

export const HeroSection: FC = () => {
    const textCn = useTextStyles();
    const isML = useML();

    return (
        <section className={styles.wrapper} id="hero" data-testid="compose-multiplatform-redesign-hero">
            <img
                src="/images/compose-multiplatform-redesign/decor-hero-render.png"
                alt=""
                aria-hidden
                className={styles['compose-multiplatform-graphic-render-1-1']}
            />
            <div className={styles.headerMobile} aria-hidden>
                <img
                    src="/images/compose-multiplatform-redesign/hero/compose-hero-mobile-graphics.webp"
                    alt=""
                    width={969}
                    height={369}
                />
            </div>
            <a
                href="https://github.com/JetBrains/compose-multiplatform"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.corner}
                aria-label="Compose Multiplatform GitHub repository"
            >
                <img
                    src="/images/compose-multiplatform-redesign/hero/corner-github.svg"
                    alt=""
                    width={111}
                    height={111}
                />
            </a>
            <div className={styles.row}>
                <div className={styles.content}>
                    <img
                        src="/images/compose-multiplatform-redesign/hero/compose-multiplatform-logo.svg"
                        alt="Compose Multiplatform logo"
                        width={128}
                        height={143}
                        className={styles.logo}
                    />
                    <h1
                        className={cn(textCn('rs-h1'), styles.title)}
                        data-testid="compose-multiplatform-redesign-hero-title"
                    >
                        Compose
                        <br />
                        Multiplatform
                    </h1>
                    <p className={cn(textCn('rs-subtitle-2', { hardness: 'hard' }), styles.subtitle)}>
                        Build beautiful shared UIs for Android, iOS, desktop, and web that feel natural on every
                        platform.
                    </p>
                    <div className={styles.platforms}>
                        {PLATFORMS.map(({ id, title, Icon }) => (
                            <Tag key={id} {...presets['outline-dark']} size="s" icon={<Icon size="s" />}>
                                {title}
                            </Tag>
                        ))}
                    </div>
                    <Button
                        size={isML ? 'm' : 'l'}
                        mode="rock"
                        theme="dark"
                        className={styles.button}
                        data-testid="compose-multiplatform-redesign-hero-cta"
                        href="/docs/multiplatform/compose-multiplatform-create-first-app.html"
                    >
                        Get started
                    </Button>
                </div>
                <div className={styles.carousel} data-testid="compose-multiplatform-redesign-hero-carousel">
                    <CustomCarousel slides={HERO_GALLERY_ITEMS} />
                </div>
            </div>
        </section>
    );
};
