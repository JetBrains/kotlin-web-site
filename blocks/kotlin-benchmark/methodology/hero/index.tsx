import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import styles from './hero.module.css';

export function MethodologyHero() {
    const textCn = useTextStyles();

    return (
        <section className={cn(styles.hero, 'ktl-layout', 'ktl-layout--center')} data-testid="methodology-hero">
            <h1 className={cn(styles.title, textCn('rs-hero'))} data-testid="methodology-title">
                Kotlin Benchmark&nbsp;— Methodology &amp; Outlook
            </h1>
        </section>
    );
}
