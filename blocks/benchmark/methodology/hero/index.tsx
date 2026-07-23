import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import styles from './hero.module.css';

export function MethodologyHero() {
    const textCn = useTextStyles();

    return (
        <section className={cn(styles.hero, 'ktl-layout', 'ktl-layout--center')} data-testid="methodology-hero">
            <h1 className={cn(styles.title, textCn('rs-h1'))} data-testid="methodology-title">
                The Kotlin Benchmark&nbsp;— Methodology and&nbsp;Outlook
            </h1>
            <p className={textCn('rs-text-1', {hardness: 'hard'})}>
                See how the Kotlin Benchmark is&nbsp;built: 105&nbsp;tasks from eight open-source Kotlin repositories,
                SWE-bench-based methodology, and&nbsp;future plans.
            </p>
        </section>
    );
}
