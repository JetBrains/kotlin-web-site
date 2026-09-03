import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { useTextStyles } from '@rescui/typography';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';
import { trackEvent } from '@/utils/event-logger';
import { REPORT_PDF_URL } from '@/blocks/state-of-kotlin-2026/constants';

import styles from './download-cta.module.css';

const RENDER_IMAGE = '/images/state-of-kotlin-2026/download-cta-render.webp';

export const DownloadCta: FC = () => {
    const textCn = useTextStyles();
    // the design drops the button a size on the narrowest screens
    const buttonSize = useMS() ? 'm' : 'l';

    const handleDownloadClick = useCallback(() => {
        trackEvent({ eventAction: 'kt_sok_download', eventLabel: 'download-cta' });
    }, []);

    return (
        <section className={styles.wrapper} data-testid="sok-download-cta">
            <div className={styles.card}>
                <img src={RENDER_IMAGE} alt="" className={styles.background} aria-hidden="true" />
                <div className={styles.content}>
                    <p className={cn(styles.title, textCn('rs-hero'))} data-testid="sok-download-cta-title">
                        15 years of data. One report.
                    </p>
                    <p className={cn(styles.lead, textCn('rs-subtitle-2'))}>
                        Six sections on adoption, organizations, talent, multiplatform, backend, and AI with the data
                        and sources behind every number on this page.
                    </p>
                    <Button
                        href={REPORT_PDF_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        mode="rock"
                        size={buttonSize}
                        className={styles.button}
                        onClick={handleDownloadClick}
                        data-testid="sok-download-cta-button"
                    >
                        Download the full report (PDF)
                    </Button>
                </div>
            </div>
        </section>
    );
};
