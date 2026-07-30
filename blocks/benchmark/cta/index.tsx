import React from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { useTextStyles } from '@rescui/typography';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';
import styles from './cta.module.css';
import { GitHubIcon } from '@rescui/icons';

interface BenchCtaProps {
    methodologyUrl: string;
    githubUrl: string;
}

export function BenchCta({ methodologyUrl, githubUrl }: BenchCtaProps) {
    const textCn = useTextStyles();
    const size = useMS() ? 'm' : 'l';

    return (
        <section className={cn(styles.cta, 'ktl-layout', 'ktl-layout--center')} data-testid="bench-cta">
            <h2 className={cn(styles.title, textCn('rs-h1'))} data-testid="bench-cta-title">
                How Kotlin Benchmark works
            </h2>
            <p className={cn(styles.text, textCn('rs-text-1'))}>
                See how the benchmark is built — the dataset of real Kotlin tasks, the harness that runs them, and how
                every result is scored.
            </p>
            <div className={styles.actions}>
                <Button mode="rock" size={size} href={methodologyUrl} data-testid="bench-cta-methodology">
                    Our Methodology
                </Button>
                <Button
                    mode="outline"
                    size={size}
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<GitHubIcon />}
                    data-testid="bench-cta-github"
                >
                    GitHub repo
                </Button>
            </div>
        </section>
    );
}
