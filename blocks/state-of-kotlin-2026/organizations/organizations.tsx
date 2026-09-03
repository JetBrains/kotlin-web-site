import React, { CSSProperties, FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { HorizontalBarchart } from '@webteam/horizontal-barchart';
import { Marquee } from '@/components/marquee';
import { SectionHeading } from '@/blocks/state-of-kotlin-2026/_shared/section-heading/section-heading';
import { StatCard } from '@/blocks/state-of-kotlin-2026/_shared/stat-card/stat-card';
import { GoDeeperBanner } from '@/blocks/state-of-kotlin-2026/_shared/go-deeper-banner/go-deeper-banner';
import { REPORT_SECTION_URLS } from '@/blocks/state-of-kotlin-2026/constants';
import { FloatingShape } from '@/blocks/state-of-kotlin-2026/_shared/floating-shape/floating-shape';
import { SHAPES } from '@/blocks/state-of-kotlin-2026/_shared/floating-shape/shapes';

import styles from './organizations.module.css';

const SIZE_BULLETS = [
    'Around one quarter of Kotlin developers work in large organizations (500+ employees)',
    'Adoption spans startups, growing companies, and global enterprises',
];

const SIZE_CHART_MODEL = {
    entries: [
        { title: 'Solo', value: 26 },
        { title: 'Small (2–50)', value: 24 },
        { title: 'Medium (51–500)', value: 21 },
        { title: 'Large (500+)', value: 25 },
    ],
};

/** Index into SIZE_CHART_MODEL.entries that the design paints in the primary colour. */
const SIZE_CHART_HIGHLIGHT = [0];

const SIZE_CHART_FOOTNOTE =
    'Kotlin adoption spans organizations of all sizes, from independent developers to large enterprises.';

const INDUSTRIES = [
    'Software development',
    'Cloud',
    'Fintech',
    'Healthcare',
    'Education',
    'Media',
    'Consumer services',
];

type CaseTag = 'Backend' | 'Cross-platform';

interface ProductionCase {
    company: string;
    tag: CaseTag;
    /** The outcome line the card shows under the logo. */
    result: string;
    logo: string;
}

/**
 * The companies from the "Teams that have already made the move" block on
 * /lp/kotlin-for-business/. Logos are the shared case-study assets, which are all
 * brand-coloured and intrinsically 64px tall.
 */
const PRODUCTION_CASES: ProductionCase[] = [
    {
        company: 'ING',
        tag: 'Backend',
        result: 'Eliminated null-related crashes to zero',
        logo: '/images/case-studies/ing-logo.svg',
    },
    {
        company: 'Amazon',
        tag: 'Backend',
        result: 'Sped up feature delivery',
        logo: '/images/case-studies/amazon-logo.svg',
    },
    {
        company: 'Google',
        tag: 'Backend',
        result: 'Increased developer productivity',
        logo: '/images/case-studies/google-logo.svg',
    },
    {
        company: 'Wolt',
        tag: 'Backend',
        result: 'Ensured payment accuracy',
        logo: '/images/case-studies/wolt-logo.svg',
    },
    {
        company: 'Worldline',
        tag: 'Backend',
        result: 'Scaled their AI platform to 1M+ users',
        logo: '/images/case-studies/worldline-logo.svg',
    },
    {
        company: 'Duolingo',
        tag: 'Cross-platform',
        result: 'Sped up shipping with shared code',
        logo: '/images/case-studies/duolingo-logo.svg',
    },
    {
        company: "McDonald's",
        tag: 'Cross-platform',
        result: 'Reduced crashes and improved performance',
        logo: '/images/case-studies/mcdonalds-logo.svg',
    },
    {
        company: 'Forbes',
        tag: 'Cross-platform',
        result: 'Started shipping features simultaneously on iOS and Android',
        logo: '/images/case-studies/forbes-logo.svg',
    },
    {
        company: 'Bolt',
        tag: 'Cross-platform',
        result: 'Built features cross-platform without expanding their team',
        logo: '/images/case-studies/bolt-logo.svg',
    },
    {
        company: 'Cash App',
        tag: 'Cross-platform',
        result: 'Streamlined collaboration between their Android and iOS teams',
        logo: '/images/case-studies/cash-app-logo.svg',
    },
    {
        company: 'Philips',
        tag: 'Cross-platform',
        result: 'Cut feature delivery cycles from 2 months to 1',
        logo: '/images/case-studies/philips-logo.svg',
    },
];

/** Card width and the gap between cards, both from the design. */
const CARD_WIDTH = 200;
const CARD_GAP = 8;

/** Pixels per second, so the strip's pace doesn't depend on how many cards it carries. */
const SCROLL_SPEED = 40;

/** Alternate the two tags, so the strip doesn't read as two blocks bolted together. */
function interleaveByTag(cases: ProductionCase[]): ProductionCase[] {
    const backend = cases.filter((item) => item.tag === 'Backend');
    const crossPlatform = cases.filter((item) => item.tag === 'Cross-platform');
    const interleaved: ProductionCase[] = [];

    for (let i = 0; i < Math.max(backend.length, crossPlatform.length); i++) {
        if (backend[i]) {
            interleaved.push(backend[i]);
        }
        if (crossPlatform[i]) {
            interleaved.push(crossPlatform[i]);
        }
    }

    return interleaved;
}

const STRIP_CASES = interleaveByTag(PRODUCTION_CASES);

const TRACK_WIDTH = STRIP_CASES.length * (CARD_WIDTH + CARD_GAP) - CARD_GAP;

const SCROLL_DURATION = Math.round(TRACK_WIDTH / SCROLL_SPEED);

export const Organizations: FC = () => {
    const textCn = useTextStyles();

    return (
        <section id="organizations" className={styles.wrapper} data-testid="sok-organizations">
            <FloatingShape shape={SHAPES.sphere} className={styles.sphere} depth={110} drift="a" />

            <SectionHeading
                title="Kotlin across organizations of every size"
                description="Kotlin is used by organizations of every size – from independent developers to large enterprises – and across a broad range of software-intensive industries. Its widespread use in production further reflects growing organizational confidence in the language."
            />

            <div className={styles.panels}>
                <div className={styles.sizePanel} data-testid="sok-organizations-size-panel">
                    <div className={styles.sizeText}>
                        <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>
                            From solo developers to global enterprises
                        </h3>
                        <div className={cn(styles.sizeBody, textCn('rs-text-1', { hardness: 'hard' }))}>
                            <p className={styles.sizeIntro}>
                                From independent developers to enterprises with 5,000+ employees
                            </p>
                            <ul className={cn(styles.bullets, textCn('rs-ul', { offsetItems: 24 }))}>
                                {SIZE_BULLETS.map((bullet, index) => (
                                    <li key={index}>{bullet}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className={styles.chartCard} data-testid="sok-organizations-size-chart">
                        <p className={cn(styles.chartCaption, textCn('rs-h5'))}>
                            Kotlin developers by organization size
                        </p>
                        <div className={styles.chartCardInner}>
                            <HorizontalBarchart model={SIZE_CHART_MODEL} coloredSections={SIZE_CHART_HIGHLIGHT} />
                        </div>
                        <p className={cn(styles.chartFootnote, textCn('rs-text-3'))}>{SIZE_CHART_FOOTNOTE}</p>
                    </div>
                </div>

                <div className={styles.industryPanel} data-testid="sok-organizations-industry-panel">
                    <div className={styles.industryRow}>
                        <div className={cn(styles.industryText, textCn('rs-text-1', { hardness: 'hard' }))}>
                            <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>
                                Run in production across industries
                            </h3>
                            <p className={cn(styles.industryLead)}>
                                Production usage is a strong indicator of organizational confidence in Kotlin.
                            </p>
                            <a
                                href="https://kotlinlang.org/lp/kotlin-for-business/"
                                className={textCn('rs-link', { external: true })}
                            >
                                Explore Kotlin for Business
                            </a>
                        </div>

                        <div className={styles.industryStat}>
                            <StatCard
                                figure="80%"
                                caption={
                                    <>
                                        of Kotlin developers
                                        <br /> use&nbsp;Kotlin in production code
                                    </>
                                }
                            />
                        </div>
                    </div>

                    <div className={styles.industryFooter}>
                        <ul
                            className={cn(styles.industries, textCn('rs-overline'))}
                            data-testid="sok-organizations-industries"
                        >
                            {INDUSTRIES.map((industry) => (
                                <li key={industry} className={styles.industry} data-testid="sok-organizations-industry">
                                    {industry}
                                </li>
                            ))}
                        </ul>

                        <div
                            role="group"
                            aria-label="Companies running Kotlin in production"
                            // under reduced motion Marquee turns the frozen track into a scroller
                            tabIndex={0}
                            className={styles.strip}
                            data-testid="sok-organizations-logo-strip"
                        >
                            <Marquee
                                className={styles.marquee}
                                style={
                                    {
                                        '--marquee-gap': `${CARD_GAP}px`,
                                        '--marquee-duration': `${SCROLL_DURATION}s`,
                                    } as CSSProperties
                                }
                                pauseOnHover
                                hasFadingEdges={false}
                                hideDuplicateFromA11y
                            >
                                {STRIP_CASES.map((item) => (
                                    <div
                                        key={item.company}
                                        className={styles.caseCard}
                                        data-testid="sok-organizations-case-card"
                                        data-company={item.company}
                                    >
                                        <img
                                            src={item.logo}
                                            alt={item.company}
                                            className={styles.caseLogo}
                                            height={40}
                                        />
                                        <p className={cn(styles.caseText, textCn('rs-h4'))}>{item.result}</p>
                                    </div>
                                ))}
                            </Marquee>
                        </div>
                    </div>
                </div>

                <GoDeeperBanner
                    text="Go deeper: Enterprise adoption"
                    href={REPORT_SECTION_URLS.organizations}
                    testId="sok-organizations-cta"
                />
            </div>
        </section>
    );
};
