import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';
import Img from 'next/image';
import { CustomCarousel } from '../../../components/custom-carousel/custom-carousel';
import heroImageDesktop from './images/compose-hero-desktop-graphics.webp';
import heroImageMobile from './images/compose-hero-mobile-graphics.webp';
import { useML, useTL } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import styles from './hero.module.css';


import { ComposeMultiplatformGalleryItems } from './hero-data';

export const ComposeMultiplatformHero: FC = () => {
    const textCn = useTextStyles();
    const isTL = useTL();
    const isML = useML();

    return (
        <section
            className={styles.wrapper}
            data-testid="hero-block"
        >
            <a
                href="https://github.com/JetBrains/compose-multiplatform"
                target="_blank"
                className={styles.githubLink}
                rel="noopener noreferrer"
                aria-label="Compose Multiplatform GitHub repository"
            >
                <img src="/images/compose-multiplatform/hero/github-logo.svg" alt="GitHub logo"
                     className={styles.githubIcon} />
            </a>
            <div className={cn(styles.hero, 'ktl-layout', 'ktl-layout--center')}>
                <Img src={isTL ? heroImageMobile : heroImageDesktop} alt="" className={styles.heroImage} />
                <div className={styles.row}>
                    <div className={styles.content}>
                        <div className={styles.logo}>
                            <img src="/images/compose-multiplatform/hero/compose-multiplatform-logo.svg"
                                 alt="Compose Multiplatform logo" className={styles.logoImg} />
                        </div>
                        <h1
                            className={cn(textCn('rs-h1'), styles.title)}
                            data-testid="hero-title"
                        >
                            Compose <br />
                            Multiplatform
                        </h1>
                        <p
                            className={cn(textCn('rs-subtitle-2', { hardness: 'hard' }), styles.subtitle)}
                            data-testid="hero-subtitle"
                        >
                            Build beautiful shared UIs for&nbsp;Android,&nbsp;iOS, desktop,
                            and web that feel natural on&nbsp;every platform.
                        </p>
                        <Button
                            size={isML ? 'm' : 'l'}
                            mode="rock"
                            theme="dark"
                            className={styles.button}
                            data-testid="hero-get-started-button"
                            href={
                                '/docs/multiplatform/compose-multiplatform-create-first-app.html'
                            }
                        >
                            Get started
                        </Button>
                    </div>
                    <div className={styles.carousel}>
                        <CustomCarousel slides={ComposeMultiplatformGalleryItems} />
                    </div>
                </div>
            </div>
        </section>
    );
};
