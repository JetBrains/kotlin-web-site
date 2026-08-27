import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { SectionHeading } from '@/blocks/state-of-kotlin-2026/_shared/section-heading/section-heading';
import { StatCard } from '@/blocks/state-of-kotlin-2026/_shared/stat-card/stat-card';
import { QuoteCard } from '@/blocks/state-of-kotlin-2026/_shared/quote-card/quote-card';
import { GoDeeperBanner } from '@/blocks/state-of-kotlin-2026/_shared/go-deeper-banner/go-deeper-banner';
import { MULTIPLATFORM_URL, REPORT_SECTION_URLS } from '@/blocks/state-of-kotlin-2026/constants';
import { FloatingShape } from '@/blocks/state-of-kotlin-2026/_shared/floating-shape/floating-shape';
import { SHAPES } from '@/blocks/state-of-kotlin-2026/_shared/floating-shape/shapes';

import styles from './multiplatform.module.css';

type Circle = { year: string; value: number };
type Quote = {
    company: string;
    logo: string;
    logoAlt: string;
    logoWidth: number;
    quote: string;
    author: string;
    role: string;
    linkText: string;
    linkHref: string;
};

/** The design draws the section title in a 744px column, which is what breaks it after "From". */
const TITLE_MAX_WIDTH = 744;

const MATURITY_CARDS = [
    'Stable since 2023',
    'Google officially endorses KMP for sharing business logic between Android and iOS',
    'Compose Multiplatform for iOS Stable since 2025',
    '4,000+ community libraries',
];

// Doubles as the accessible label for the circle chart below.
const GROWTH_CIRCLE_LEAD =
    "KMP's share among cross-platform developers more than doubled in one year, from 7% (2024) to 18% (2025)";

const GROWTH_CIRCLES: Circle[] = [
    { year: '2024', value: 7 },
    { year: '2025', value: 18 },
];

/** Diameter of the 100% track every bubble is measured against, in px. */
const CIRCLE_TRACK_DIAMETER = 160;

/**
 * The design sizes each bubble by area, not by diameter – 7% and 18% of the track come out at
 * 42px and 68px, which is `sqrt(share)`, not `share`.
 */
const circleDiameter = (value: number) => CIRCLE_TRACK_DIAMETER * Math.sqrt(value / 100);

/**
 * Below this the bubble is too small to hold its own label, so the design moves the label out
 * to the right of the bubble instead of centring it inside.
 */
const LABEL_FITS_FROM = 56;

const GROWTH_CARDS = [
    'Its footprint in the App Store top 10,000 nearly tripled since early 2024, and over the past year KMP added more top-10,000 apps than Flutter',
    'Across KMP case studies overall, hundreds of millions of users interact with KMP-powered apps daily',
];

const PRODUCTION_QUOTES: Quote[] = [
    {
        company: 'Booking.com',
        logo: '/images/state-of-kotlin-2026/multiplatform-logo-booking.svg',
        logoAlt: 'Booking.com',
        logoWidth: 135,
        quote: "Adopting KMP for our experimentation library was a calculated bet. […] The reality exceeded our expectations: KMP performed great on iOS, proving it's a viable, long-term solution for our team.",
        author: 'Diego Gómez Olvera',
        role: 'Principal Android Developer',
        linkText: 'Read the full story',
        linkHref:
            'https://medium.com/booking-com-development/kotlin-multiplatform-in-production-two-real-world-use-cases-from-booking-com-46ffe13a773d',
    },
    {
        company: 'Duolingo',
        logo: '/images/state-of-kotlin-2026/multiplatform-logo-duolingo.svg',
        logoAlt: 'Duolingo',
        logoWidth: 174,
        quote: 'The more that we use Kotlin Multiplatform internally, the more we find ourselves speeding up in terms of shipping.',
        author: 'John Rodriguez',
        role: 'The client platform team',
        linkText: 'Watch video',
        linkHref: 'https://youtu.be/RJtiFt5pbfs',
    },
    {
        company: 'Sony',
        logo: '/images/state-of-kotlin-2026/multiplatform-logo-sony.svg',
        logoAlt: 'Sony',
        logoWidth: 114,
        quote: "Sony's journey to Kotlin Multiplatform wasn't just about efficiency; it was about capability. We migrated from native plans to a unified KMP and Compose Multiplatform workflow, delivering a robust companion app for our flagship headphones […] to millions of users worldwide.",
        author: 'Sergio Carrilho',
        role: 'TechLead at Sony',
        linkText: 'Watch video',
        linkHref: 'https://youtu.be/VVf6txPZk3Y',
    },
];

export const Multiplatform: FC = () => {
    const textCn = useTextStyles();
    const lastCircleIndex = GROWTH_CIRCLES.length - 1;

    return (
        <section id="multiplatform" className={styles.wrapper} data-testid="sok-multiplatform">
            <FloatingShape shape={SHAPES.cube} className={styles.cube} depth={100} drift="d" />

            <SectionHeading
                title="Kotlin Multiplatform: From experiment to strategic platform"
                description="Kotlin Multiplatform has evolved from an experimental technology into a production-ready platform for cross-platform development. Organizations use it to share business logic, and increasingly user interfaces, across Android, iOS, desktop, web, and server, while preserving native flexibility."
                titleMaxWidth={TITLE_MAX_WIDTH}
            />

            <div className={styles.panels}>
                <div className={cn(styles.panel, textCn('rs-text-1'))}>
                    <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>
                        Production-ready and backed for the long run
                    </h3>
                    <div className={styles.maturityRow}>
                        {MATURITY_CARDS.map((card, index) => (
                            <div className={styles.maturityCard} key={index}>
                                <p className={cn(styles.maturityText, textCn('rs-text-1'))}>{card}</p>
                            </div>
                        ))}
                    </div>
                    <a href={MULTIPLATFORM_URL} className={cn(styles.link, textCn('rs-link', { external: true }))}>
                        Get started with Kotlin Multiplatform
                    </a>
                </div>

                <div className={styles.panel}>
                    <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>
                        The fastest-growing cross-platform technology
                    </h3>
                    <div className={styles.growthTopCard}>
                        <p className={cn(styles.growthLead, textCn('rs-text-1'))}>{GROWTH_CIRCLE_LEAD}</p>
                        <div className={styles.circles} role="img" aria-label={GROWTH_CIRCLE_LEAD}>
                            {GROWTH_CIRCLES.map((circle, index) => {
                                const diameter = circleDiameter(circle.value);
                                const isActive = index === lastCircleIndex;
                                const labelInside = diameter >= LABEL_FITS_FROM;

                                return (
                                    <div className={styles.circleItem} key={index} aria-hidden="true">
                                        <div className={styles.circleTrack}>
                                            <div
                                                className={cn(styles.circleBubble, {
                                                    [styles.circleBubbleActive]: isActive,
                                                })}
                                                style={{ width: `${diameter}px`, height: `${diameter}px` }}
                                            />
                                            <span
                                                className={cn(
                                                    styles.circleValue,
                                                    textCn('rs-text-2'),
                                                    labelInside ? styles.circleValueInside : styles.circleValueOutside
                                                )}
                                                style={
                                                    labelInside
                                                        ? undefined
                                                        : { left: `calc(50% + ${diameter / 2}px + 7px)` }
                                                }
                                            >
                                                {circle.value}%
                                            </span>
                                        </div>
                                        <p
                                            className={cn(
                                                styles.circleYear,
                                                textCn('rs-h5'),
                                                isActive && styles.circleYearActive
                                            )}
                                        >
                                            {circle.year}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.growthCardsRow}>
                        {GROWTH_CARDS.map((card, index) => (
                            <div className={styles.growthCard} key={index}>
                                <p className={cn(styles.growthCardText, textCn('rs-text-1'))}>{card}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.panel}>
                    <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>Business impact</h3>
                    <div className={styles.impactGrid}>
                        <StatCard
                            figure="60%"
                            caption="of KMP projects share all or almost all of their business logic"
                            className={styles.impactCard}
                        />
                        <StatCard
                            figure="72%"
                            caption="of teams report faster development, 70% higher app quality, and 55% better collaboration"
                            className={styles.impactCard}
                        />
                        <StatCard
                            figure="Native UX"
                            caption="Adopters report shipping features faster without giving up native UX"
                            className={cn(styles.impactCard, styles.impactCardFull)}
                        />
                    </div>
                </div>

                <div className={styles.panel}>
                    <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>Kotlin Multiplatform in production</h3>
                    <div className={styles.quoteRow}>
                        {PRODUCTION_QUOTES.map((quote, index) => (
                            <QuoteCard
                                key={index}
                                logoSrc={quote.logo}
                                logoAlt={quote.logoAlt}
                                logoWidth={quote.logoWidth}
                                company={quote.company}
                                quote={quote.quote}
                                author={quote.author}
                                role={quote.role}
                                linkText={quote.linkText}
                                linkHref={quote.linkHref}
                                className={styles.quoteCard}
                                testId={`sok-multiplatform-quote-${index}`}
                            />
                        ))}
                    </div>
                </div>

                <GoDeeperBanner
                    text="Go deeper: Kotlin Multiplatform"
                    href={REPORT_SECTION_URLS.multiplatform}
                    testId="sok-multiplatform-cta"
                />
            </div>
        </section>
    );
};
