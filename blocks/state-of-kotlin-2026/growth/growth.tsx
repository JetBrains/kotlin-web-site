import React, { FC, ReactNode } from 'react';
import cn from 'classnames';
import { createTextCn, useTextStyles } from '@rescui/typography';
import { SectionHeading } from '@/blocks/state-of-kotlin-2026/_shared/section-heading/section-heading';
import { ChartFigure } from '@/blocks/state-of-kotlin-2026/_shared/chart-figure/chart-figure';
import { GoDeeperBanner } from '@/blocks/state-of-kotlin-2026/_shared/go-deeper-banner/go-deeper-banner';
import { REPORT_SECTION_URLS } from '@/blocks/state-of-kotlin-2026/constants';

import styles from './growth.module.css';

const CHART_ALT =
    'Kotlin adoption timeline from 2011 (Kotlin announced) to 2026 (Kotlin across the full stack), trending steadily upward.';

type Ranking = { title: string; linkText?: string; href?: string; text?: ReactNode };

const staticTextCn = createTextCn();

const REDMONK_2025_URL = 'https://redmonk.com/sogrady/2025/06/18/language-rankings-1-25/';
const REDMONK_2026_URL = 'https://redmonk.com/sogrady/2026/04/14/language-rankings-1-26/';

const RANKINGS: Ranking[] = [
    {
        title: 'GitHub Octoverse 2024',
        linkText: 'Top-5 fastest-growing languages',
        href: 'https://github.blog/news-insights/octoverse/octoverse-2024/',
    },
    {
        title: 'Stack Overflow 2024',
        linkText: 'Among the most admired languages',
        href: 'https://survey.stackoverflow.co/2024/technology#admired-and-desired',
    },
    {
        title: 'RedMonk language rankings',
        
        text: (
            <>
                #14 in{' '}
                <a
                    href={REDMONK_2025_URL}
                    className={staticTextCn('rs-link')}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    2025
                </a>{' '}
                and{' '}
                <a
                    href={REDMONK_2026_URL}
                    className={staticTextCn('rs-link')}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    2026
                </a>
            </>
        ),
    },
];

export const Growth: FC = () => {
    const textCn = useTextStyles();

    return (
        <section id="growth" className={styles.wrapper} data-testid="sok-growth">
            <SectionHeading
                title="15 years of steady growth"
                description="Fifteen years in, Kotlin is still growing – and the developers who join tend to stay. Independent rankings show the same curve."
            />

            <div className={styles.row}>
                <ChartFigure
                    src="/images/state-of-kotlin-2026/growth-adoption-curve.webp"
                    alt={CHART_ALT}
                    width={776}
                    height={533}
                    className={styles.chart}
                />

                <div className={styles.rankings}>
                    {RANKINGS.map((ranking, index) => (
                        <div className={cn(styles.rankingCard)} key={index}>
                            <p className={cn(styles.rankingTitle, textCn('rs-h3'))}>{ranking.title}</p>
                            {ranking.linkText && (
                                <a
                                    href={ranking.href || ''}
                                    className={cn(styles.rankingLink, textCn('rs-text-1', { hardness: 'hard' }))}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {ranking.linkText}
                                </a>
                            )}
                            {ranking.text && (
                                <p className={cn(styles.rankingText, textCn('rs-text-1', { hardness: 'hard' }))}>
                                    {ranking.text}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <GoDeeperBanner
                className={styles.goDeeperBanner}
                text="Go deeper: The adoption curve"
                href={REPORT_SECTION_URLS.growth}
                testId="sok-growth-cta"
            />
        </section>
    );
};
