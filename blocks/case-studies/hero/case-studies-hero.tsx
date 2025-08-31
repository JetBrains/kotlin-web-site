import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import '@jetbrains/kotlin-web-site-ui/out/components/layout';
import styles from './case-studies-hero.module.css';

export const CaseStudiesHero: React.FC = () => {
    const textCn = useTextStyles();

    return (
        <section data-testid="case-studies-hero" aria-label="Case Studies Hero">
            <div className={styles.wrapper}>
                <div className={cn('ktl-layout', 'ktl-layout--center')}>
                    <div className={styles.content}>
                        <h1 className={cn(textCn('rs-hero'), styles.title)}>
                            Case studies
                        </h1>
                        <p className={cn(textCn('rs-text-1'), styles.subtitle)}>
                            Discover how companies of all sizes and industries apply Kotlin across client and server. From building cross-platform applications with shared logic and UI using Kotlin Multiplatform and Compose Multiplatform to developing reliable, high-performance backends with Kotlin — explore real-world strategies, integration approaches, and the benefits teams gain from using Kotlin in production.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
