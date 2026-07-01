import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import styles from './hero.module.css';

export function BenchHero() {
    const textCn = useTextStyles();

    return (
        <section className={cn(styles.hero, 'ktl-layout', 'ktl-layout--center')} data-testid="bench-hero">
            <h1 className={cn(styles.title, textCn('rs-hero'))} data-testid="bench-hero-title">
                Kotlin Benchmark
            </h1>
            <p className={cn(styles.intro, textCn('rs-subtitle-2'))} data-testid="bench-hero-intro">
                Kotlin Benchmark is a&nbsp;continuous initiative for&nbsp;measuring coding agent performance across
                multiple dimensions. It is designed as an&nbsp;independent source for&nbsp;Kotlin AI&nbsp;quality,
                helping you choose the tool that best fits your&nbsp;needs.
            </p>
        </section>
    );
}
