import React, { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { ArrowRightIcon } from '@rescui/icons';
import { useTextStyles } from '@rescui/typography';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import ctaGraphics from '@/public/images/state-of-kotlin-2026/hero-cylinder.webp';
import { CONTACT_TEAM_URL } from '../constants';

import shared from '../kotlin-lts.module.css';
import styles from './cta.module.css';

export const Cta: FC = () => {
    const textCn = useTextStyles();
    const buttonSize = useMS() ? 'm' : 'l';

    return (
        <section className={styles.cta} aria-labelledby="lts-cta-title" data-testid="lts-cta">
            <div className={cn('ktl-layout', 'ktl-layout--center', styles.content)}>
                <div className={styles.copy}>
                    <h2 id="lts-cta-title" className={cn(textCn('rs-h1'), shared.title)} data-testid="lts-cta-title">
                        Discuss coverage for your stack
                    </h2>
                    <p className={cn(textCn('rs-subtitle-2', { hardness: 'average' }), styles.text)}>
                        Start with a free assessment. We’ll review the Kotlin components and versions you need to
                        cover, discuss any upgrade constraints, and help you decide whether paid Kotlin LTS is right
                        for your team.
                    </p>
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
                </div>
                <div className={styles.artwork} aria-hidden="true">
                    <Image src={ctaGraphics} alt="" sizes="(max-width: 640px) 420px, 600px" className={styles.image} />
                </div>
            </div>
        </section>
    );
};
