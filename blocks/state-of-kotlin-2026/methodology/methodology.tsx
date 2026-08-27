import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './methodology.module.css';

export const Methodology: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} data-testid="sok-methodology">
            <p className={cn(styles.text, textCn('rs-text-2'))}>
                The State of Kotlin 2026 report is based on the JetBrains State of Developer Ecosystem Survey, the
                Kotlin Developer Survey, the Kotlin Multiplatform Survey, a KotlinConf 2026 community survey on AI tool
                usage, anonymized JetBrains IDE telemetry data, and independent sources including GitHub Octoverse,
                Stack Overflow, and RedMonk.
            </p>
        </section>
    );
};
