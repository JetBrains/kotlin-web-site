import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import styles from './hero.module.css';

const INTRO =
    'Kotlin Benchmark is a continuous initiative for measuring coding agent performance across ' +
    'multiple dimensions. It is designed as an independent source for Kotlin AI quality, helping ' +
    'you choose the tool that best fits your needs.';

export function BenchHero() {
    const textCn = useTextStyles();

    return (
        <section className={cn(styles.hero, 'ktl-layout', 'ktl-layout--center')} data-testid="bench-hero">
            <h1 className={cn(styles.title, textCn('rs-hero'))} data-testid="bench-hero-title">
                <span className={styles.gradientText}>Kotlin</span> Benchmark
            </h1>
            <p className={cn(styles.intro, textCn('rs-text-1'))} data-testid="bench-hero-intro">
                {INTRO}
            </p>
        </section>
    );
}
