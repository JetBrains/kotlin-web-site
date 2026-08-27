import React, { FC, ReactNode } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { HorizontalBarchart } from '@webteam/horizontal-barchart';
import { SectionHeading } from '@/blocks/state-of-kotlin-2026/_shared/section-heading/section-heading';
import { StatCard } from '@/blocks/state-of-kotlin-2026/_shared/stat-card/stat-card';
import { GoDeeperBanner } from '@/blocks/state-of-kotlin-2026/_shared/go-deeper-banner/go-deeper-banner';
import { REPORT_SECTION_URLS } from '@/blocks/state-of-kotlin-2026/constants';
import { FloatingShape } from '@/blocks/state-of-kotlin-2026/_shared/floating-shape/floating-shape';
import { SHAPES } from '@/blocks/state-of-kotlin-2026/_shared/floating-shape/shapes';

import styles from './backend.module.css';

type Stat = { figure: string; caption: ReactNode };
type Commitment = { text: string; href: string };
type ProductionCase = {
    company: string;
    logo: string;
    logoAlt: string;
    logoWidth: number;
    text: ReactNode;
    linkText: string;
    linkHref: string;
};

const SIZE_CHART_MODEL = {
    entries: [
        { title: '1 developer', value: 16 },
        { title: '2–5', value: 23 },
        { title: '6–20', value: 38 },
        { title: '21–100', value: 67 },
        { title: '100+', value: 89 },
    ],
};

/** Index into SIZE_CHART_MODEL.entries that the design paints in the primary colour. */
const SIZE_CHART_HIGHLIGHT = [SIZE_CHART_MODEL.entries.length - 1];

const SIZE_CHART_FOOTNOTE =
    '*Anonymized JetBrains IDE data; commercial organizations doing backend development. An organization counts as using Kotlin if at least one of its backend developers works with Kotlin.';

const PRODUCTIVITY_FOOTNOTE =
    '*Cycle-time comparison: JetBrains Research, IDE telemetry of ~320,000 developers and ~28M development cycles';

const MODERNIZATION_STATS: Stat[] = [
    {
        figure: '8×higher',
        caption: 'Kotlin adoption among projects that migrated Spring Boot 2→3, compared with teams that stayed put',
    },
    { figure: '70%', caption: 'of new Kotlin backend adopters already had Spring in their project' },
    {
        figure: 'Now',
        caption:
            'is the moment: Spring Boot 3 reached open-source end-of-life in June 2026, and the Spring Boot 4 migration is exactly when teams add Kotlin',
    },
];

const COMMITMENTS: Commitment[] = [
    {
        text: 'Strategic Spring partnership since 2025',
        href: 'https://blog.jetbrains.com/kotlin/2025/05/strategic-partnership-with-spring/',
    },
    {
        text: 'Security & support policy for the Kotlin stdlib since 2026',
        href: 'https://blog.jetbrains.com/kotlin/2026/05/security-support-policy-for-the-kotlin-standard-library/',
    },
];

const FRAMEWORK_STATS: Stat[] = [
    { figure: '61%', caption: 'of Kotlin developers use Spring / Spring Boot' },
    { figure: '51%', caption: 'of Kotlin backend developers use Ktor' },
];

const PRODUCTION_CASES: ProductionCase[] = [
    {
        company: 'Amazon',
        logo: '/images/state-of-kotlin-2026/backend-logo-amazon.svg',
        logoAlt: 'Amazon',
        logoWidth: 115,
        text: 'Migrated a 10,000-line backend service from Java to Kotlin – powering an AI-driven size recommendation system for hundreds of millions of customers across 19 locales.',
        linkText: 'Watch video',
        linkHref: 'https://www.youtube.com/watch?v=rvyUgcxfang',
    },
    {
        company: 'Wolt',
        logo: '/images/state-of-kotlin-2026/backend-logo-wolt.svg',
        logoAlt: 'Wolt',
        logoWidth: 100,
        text: "Kotlin is a core part of Wolt's backend systems and engineering culture, powering their delivery platform.",
        linkText: 'Watch video',
        linkHref: 'https://www.youtube.com/watch?v=puBXoKkQInE',
    },
    {
        company: 'ING',
        logo: '/images/state-of-kotlin-2026/backend-logo-ing.svg',
        logoAlt: 'ING',
        logoWidth: 144,
        text: (
            <>
                Modernized its mission-critical payment engine – <b>6M mobile users</b>, <b>4.5B payments a year</b> –
                migrating from Java to Kotlin for code quality, stability, and resource efficiency.
            </>
        ),
        linkText: 'Watch video',
        linkHref: 'https://www.youtube.com/watch?v=mexcjkGZIm8',
    },
];

export const Backend: FC = () => {
    const textCn = useTextStyles();

    return (
        <section id="backend" className={styles.wrapper} data-testid="sok-backend">
            <FloatingShape shape={SHAPES.cylinder} className={styles.cylinder} depth={90} drift="b" />
            <FloatingShape shape={SHAPES.pentagon} className={styles.pentagon} depth={130} drift="c" />

            <SectionHeading
                title="Backend: production-proven on the JVM"
                description="Backend is one of Kotlin's largest domains: over half of Kotlin developers work on backend projects. Kotlin compiles to the same bytecode as Java and calls existing Java code directly, so it enters organizations service by service, without big rewrites."
            />

            <div className={styles.panels}>
                <div className={styles.topRow}>
                    <div className={styles.gradientCard}>
                        <h3 className={cn(styles.cardTitle, textCn('rs-h3'))}>
                            The larger the organization, the more likely Kotlin is already there
                        </h3>
                        <div className={styles.whiteCard} data-testid="sok-backend-size-chart">
                            <p className={cn(styles.chartCaption, textCn('rs-h5'))}>
                                Share of organizations with any Kotlin on the backend, by number of backend developers:
                            </p>
                            <HorizontalBarchart
                                className={styles.chart}
                                model={SIZE_CHART_MODEL}
                                coloredSections={SIZE_CHART_HIGHLIGHT}
                            />
                            <p className={cn(styles.smallFootnote, textCn('rs-text-3', { hardness: 'pale' }))}>
                                {SIZE_CHART_FOOTNOTE}
                            </p>
                        </div>
                    </div>

                    <div className={styles.gradientCard}>
                        <h3 className={cn(styles.cardTitle, textCn('rs-h3'))}>A measurable productivity payoff</h3>
                        <div className={cn(styles.whiteCard, styles.statCardInner)}>
                            <p className={cn(styles.figure, textCn('rs-hero'))}>15–20%</p>
                            <div className={styles.figureFooter}>
                                <p className={cn(styles.caption, textCn('rs-text-1'))}>
                                    shorter development cycles than comparable Java tasks
                                </p>
                                <p className={cn(styles.smallFootnote, textCn('rs-text-3', { hardness: 'pale' }))}>
                                    {PRODUCTIVITY_FOOTNOTE}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.panel}>
                    <div className={styles.panelHeading}>
                        <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>
                            Kotlin adoption happens at modernization moments
                        </h3>
                        <p className={cn(styles.panelLead, textCn('rs-text-1'))}>
                            Java teams revisit the language question when they’re already reworking the codebase
                        </p>
                    </div>
                    <div className={styles.statRow}>
                        {MODERNIZATION_STATS.map((stat, index) => (
                            <StatCard
                                key={index}
                                figure={stat.figure}
                                caption={stat.caption}
                                className={styles.flexCard}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.panel}>
                    <div className={styles.panelHeading}>
                        <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>Committed for the long run</h3>
                        <p className={cn(styles.panelLead, textCn('rs-text-1'))}>
                            A backend language is a decade-long choice – and the ecosystem behind Kotlin treats it that
                            way:
                        </p>
                    </div>
                    <div className={styles.commitmentRow}>
                        <div className={styles.commitmentList}>
                            {COMMITMENTS.map((commitment, index) => (
                                <div className={styles.commitmentCard} key={index}>
                                    <a
                                        href={commitment.href}
                                        className={cn(styles.commitmentLink, textCn('rs-text-1'))}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {commitment.text}
                                    </a>
                                </div>
                            ))}
                        </div>
                        <div className={styles.frameworksColumn}>
                            <h4 className={cn(styles.frameworksTitle, textCn('rs-h3'))}>Runs on your frameworks</h4>
                            <div className={styles.frameworksRow}>
                                {FRAMEWORK_STATS.map((stat, index) => (
                                    <div className={styles.frameworkStat} key={index}>
                                        <p className={cn(styles.frameworkFigure, textCn('rs-h1'))}>{stat.figure}</p>
                                        <p className={cn(styles.frameworkCaption, textCn('rs-text-1'))}>
                                            {stat.caption}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.panel}>
                    <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>Backend Kotlin in production</h3>
                    <div className={styles.caseRow}>
                        {PRODUCTION_CASES.map((productionCase, index) => (
                            <div className={cn(styles.caseCard, textCn('rs-text-1'))} key={index}>
                                <div className={styles.caseBody}>
                                    <img
                                        src={productionCase.logo}
                                        alt={productionCase.logoAlt}
                                        className={styles.caseLogo}
                                        width={productionCase.logoWidth}
                                        height={48}
                                    />
                                    <div className={styles.caseTextGroup}>
                                        <h4 className={cn(styles.caseCompany, textCn('rs-h3'))}>
                                            {productionCase.company}
                                        </h4>
                                        <p className={cn(styles.caseText, textCn('rs-text-1'))}>
                                            {productionCase.text}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={productionCase.linkHref}
                                    className={cn(styles.caseLink, textCn('rs-link'))}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {productionCase.linkText}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <GoDeeperBanner
                    text="Go deeper: Backend Kotlin"
                    href={REPORT_SECTION_URLS.backend}
                    testId="sok-backend-cta"
                />
            </div>
        </section>
    );
};
