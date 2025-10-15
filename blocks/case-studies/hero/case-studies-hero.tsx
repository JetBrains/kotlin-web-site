import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import styles from './case-studies-hero.module.css';

export const CaseStudiesHero: React.FC = () => {
    const textCn = useTextStyles();
    return (
        <section className="ktl-layout ktl-layout--center" data-testid="case-studies-hero" aria-label="Case Studies Hero">
            <div className={styles.content}>
                <h1 className={cn(textCn('rs-hero'), styles.title)} data-testid="case-studies-hero-title">
                    Case studies
                </h1>
                <p className={cn(textCn('rs-text-1'), styles.subtitle)} data-testid="case-studies-hero-subtitle">
                    Discover how companies of all sizes and industries apply Kotlin across client and server. From
                    building cross-platform applications with shared logic and UI using Kotlin Multiplatform and
                    Compose Multiplatform to developing reliable, high-performance backends with Kotlin — explore
                    real-world strategies, integration approaches, and the benefits teams gain from using Kotlin in
                    production.
                </p>
            </div>
        </section>
    );
};
