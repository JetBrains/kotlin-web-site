import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import styles from './hero.module.css';
import { MethodologyVersion } from '../versions';
import { MethodologyVersionSwitcher } from '../version-switcher';

interface MethodologyHeroProps {
    methodology: MethodologyVersion;
}

export function MethodologyHero({ methodology }: MethodologyHeroProps) {
    const textCn = useTextStyles();

    return (
        <section className={cn(styles.hero, 'ktl-layout', 'ktl-layout--center')} data-testid="methodology-hero">
            <h1 className={cn(styles.title, textCn('rs-h1'))} data-testid="methodology-title">
                The Kotlin Benchmark&nbsp;— Methodology and&nbsp;Outlook
            </h1>
            <MethodologyVersionSwitcher version={methodology.version} />
            <p className={textCn('rs-text-1', { hardness: 'hard' })}>
                See how the Kotlin Benchmark is&nbsp;built: {methodology.totalTasks}&nbsp;tasks from{' '}
                {methodology.repositoryCountWord} open-source Kotlin repositories, SWE-bench-based methodology,
                and&nbsp;future plans.
            </p>
        </section>
    );
}
