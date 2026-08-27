import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { useTextStyles } from '@rescui/typography';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';
import { SocialShare, SocialNetwork } from '@/components/social-share/social-share';
import { trackEvent } from '@/utils/event-logger';
import { REPORT_PDF_URL } from '@/blocks/state-of-kotlin-2026/constants';

import styles from './hero.module.css';

const SHARE_NETWORKS: SocialNetwork[] = ['twitter', 'facebook', 'linkedin', 'reddit', 'email'];

export const Hero: FC = () => {
    const textCn = useTextStyles();
    // the design drops the controls a size on the narrowest screens
    const controlSize = useMS() ? 'm' : 'l';

    const handleDownloadClick = useCallback(() => {
        trackEvent({ eventAction: 'kt_sok_download', eventLabel: 'hero' });
    }, []);

    const handleShareClick = useCallback((network: SocialNetwork) => {
        trackEvent({ eventAction: 'kt_sok_hero_share', eventLabel: network });
    }, []);

    return (
        <section className={styles.hero} data-testid="sok-hero">
            <div>
                <h1 className={cn(styles.title, textCn('rs-super-hero'))} data-testid="sok-hero-title">
                    The State of Kotlin in 2026
                </h1>
                <p className={cn(styles.lead, textCn('rs-subtitle-1'))}>
                    15 years of growth, trust, and ecosystem maturity — spanning 8.1M developers worldwide.
                </p>
            </div>

            <div className={styles.actions}>
                <Button
                    href={REPORT_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    mode="rock"
                    size={controlSize}
                    className={styles.downloadButton}
                    onClick={handleDownloadClick}
                    data-testid="sok-hero-download"
                >
                    Download the full report (PDF)
                </Button>

                <SocialShare
                    label="Share"
                    size={controlSize}
                    className={styles.share}
                    networks={SHARE_NETWORKS}
                    onShareClick={handleShareClick}
                />
            </div>
        </section>
    );
};
