import React from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { useTextStyles } from '@rescui/typography';

import glassPadlock from './images/glass-padlock.webp';
import styles from './security-newsletter.module.css';

export function SecurityNewsletter() {
    const textCn = useTextStyles();

    return (
        <section className="ktl-layout ktl-layout--center" aria-labelledby="security-newsletter-title">
            <div className={styles.card}>
                <div className={styles.copy}>
                    <h2 id="security-newsletter-title" className={cn(textCn('rs-h2'), styles.title)}>
                        Kotlin Security Newsletter
                    </h2>
                    <p className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.description)}>
                        Get a free email digest of security fixes, affected versions, and dependency updates for Kotlin
                        and Ktor.
                    </p>
                </div>
                <Image src={glassPadlock} alt="" className={styles.artwork} />
                <Button
                    className={styles.action}
                    mode="rock"
                    size="l"
                    href="/kotlin-security-newsletter/"
                    aria-label="Subscribe to the Kotlin Security Newsletter"
                >
                    Subscribe
                </Button>
            </div>
        </section>
    );
}
