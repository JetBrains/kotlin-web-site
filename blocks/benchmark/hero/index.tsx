import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import styles from './hero.module.css';

export function BenchHero() {
    const textCn = useTextStyles();

    return (
        <section className={cn(styles.hero, 'ktl-layout', 'ktl-layout--center')} data-testid="bench-hero">
            <h1 className={cn(styles.title, textCn('rs-hero'))} data-testid="bench-hero-title">
                The Kotlin Benchmark
            </h1>
            <p className={cn(styles.intro, textCn('rs-text-1', { hardness: 'hard' }))} data-testid="bench-hero-intro">
                The Kotlin Benchmark is&nbsp;built to&nbsp;evaluate models on&nbsp;realistic, idiomatic Kotlin
                engineering tasks across multiple&nbsp;dimensions.
            </p>
        </section>
    );
}
