import React, { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { ArrowRightIcon } from '@rescui/icons';
import { useTextStyles } from '@rescui/typography';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import { CONTACT_TEAM_URL, SECTION_IDS } from '../constants';

import heroGraphics from '@/public/images/state-of-kotlin-2026/hero-triangle.webp';
import cubeGraphics from '@/public/images/state-of-kotlin-2026/deco-cube.webp';
import sphereGraphics from '@/public/images/state-of-kotlin-2026/deco-sphere.webp';
import styles from './hero.module.css';

export const Hero: FC = () => {
    const textCn = useTextStyles();
    const buttonSize = useMS() ? 'm' : 'l';

    return (
        <section className={styles.hero} aria-labelledby="lts-title" data-testid="lts-hero">
            <div className={cn('ktl-layout', 'ktl-layout--center', styles.content)}>
                <div className={styles.copy}>
                    <h1 id="lts-title" className={cn(textCn('rs-hero'), styles.title)} data-testid="lts-hero-title">
                        Kotlin <span className={styles.titleLine}>Targeted Security Patches</span>
                    </h1>
                    <p className={cn(textCn('rs-text-1', { hardness: 'average' }), styles.description)}>
                        Commercial security support to address vulnerabilities in components and release lines of your
                        Kotlin stack with less upgrade effort.
                    </p>
                    <div className={styles.actions}>
                        <Button
                            mode="classic"
                            size={buttonSize}
                            icon={<ArrowRightIcon />}
                            iconPosition="right"
                            className={styles.button}
                            href={CONTACT_TEAM_URL}
                        >
                            Contact team
                        </Button>
                        <Button
                            mode="outline"
                            size={buttonSize}
                            href={`#${SECTION_IDS.benefits}`}
                            className={styles.button}
                        >
                            What's included
                        </Button>
                    </div>
                </div>
                <div className={styles.artwork} aria-hidden="true">
                    <Image
                        src={heroGraphics}
                        alt=""
                        priority
                        sizes="(max-width: 640px) 460px, (max-width: 1000px) 540px, 700px"
                        className={styles.heroImage}
                    />
                    <Image
                        src={cubeGraphics}
                        alt=""
                        sizes="(max-width: 640px) 140px, (max-width: 1000px) 170px, 210px"
                        className={cn(styles.detailImage, styles.cubeImage)}
                    />
                    <Image
                        src={sphereGraphics}
                        alt=""
                        sizes="(max-width: 640px) 120px, (max-width: 1000px) 140px, 180px"
                        className={cn(styles.detailImage, styles.sphereImage)}
                    />
                </div>
            </div>
        </section>
    );
};
