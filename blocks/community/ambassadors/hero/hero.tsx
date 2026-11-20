import React, { FC } from 'react';
import cn from 'classnames';

import { useTextStyles } from '@rescui/typography';

import styles from './hero.module.css';

const BENEFITS = [
    {
        id: 'visibility',
        title: (
            <>
                Visibility for <br className={styles.signBreak} />
                Ambassadors' work
            </>
        ),
        description:
            'Articles, talks, videos, projects, and other contributions can be featured through official Kotlin channels.',
    },
    {
        id: 'talk-to-kotlin',
        title: 'Straight talk with the Kotlin team',
        description:
            'Ambassadors join quarterly sessions with the Kotlin team to explore the direction of the ecosystem, exchange ideas, and share feedback.',
    },
    {
        id: 'global-circle',
        title: 'A global circle of Kotlin experts',
        description:
            'Creators, educators, and community leaders from around the world in one place. A space to swap ideas, share experience, and collaborations.',
    },
    {
        id: 'community-activities',
        title: 'Support for community activities',
        description:
            'Ambassadors get access to Kotlin and JetBrains swag, subscription giveaways to support their meetups, workshops, and other initiatives.',
    },
    {
        id: 'jetbrains-subscription',
        title: 'Complimentary JetBrains subscription',
        description: 'Every Ambassador receives a free annual personal JetBrains subscription.',
    },
    {
        id: 'kotlinconf-tickets',
        title: 'KotlinConf tickets',
        description: 'Ambassadors attend KotlinConf with free tickets.',
    },
] as const;

export const Hero: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.hero} data-testid="ambassadors-hero">
            <div
                className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}
                data-testid="ambassadors-hero-content"
            >
                <div className={styles.heading}>
                    <img
                        className={styles.sign}
                        data-testid="ambassadors-sign"
                        src="/images/community/ambassadors/sign.svg"
                        alt="ambassadors sign"
                    />
                    <h1 className={cn(textCn('rs-hero'), styles.title)} data-testid="ambassadors-hero-title">
                        Kotlin Ambassadors Program
                    </h1>
                    <p className={cn(textCn('rs-subtitle-2'), styles.subtitle)} data-testid="ambassadors-hero-subtitle">
                        A program for creators, educators, and community leaders making a lasting impact on the Kotlin
                        ecosystem.
                    </p>
                </div>
                <div className={styles.gradientBlock} data-testid="ambassadors-gradient-block">
                    <div className={styles.layer} data-testid="ambassadors-hero-decoration">
                        <img
                            className={styles.seal}
                            src="/images/community/ambassadors/seal.webp"
                            srcSet="/images/community/ambassadors/seal.webp 1x, /images/community/ambassadors/seal@2x.webp 2x, /images/community/ambassadors/seal@3x.webp 3x"
                            alt="ambassador seal"
                        />
                        <img
                            aria-hidden="true"
                            className={styles.kElement}
                            src="/images/community/ambassadors/k-element.webp"
                            srcSet="/images/community/ambassadors/k-element.webp 1x, /images/community/ambassadors/k-element@2x.webp 2x, /images/community/ambassadors/k-element@3x.webp 3x"
                            alt=""
                        />
                        <img
                            aria-hidden="true"
                            className={styles.contributorBadge}
                            src="/images/community/ambassadors/badge-contributor.webp"
                            srcSet="/images/community/ambassadors/badge-contributor.webp 1x, /images/community/ambassadors/badge-contributor@2x.webp 2x, /images/community/ambassadors/badge-contributor@3x.webp 3x"
                            alt=""
                        />
                    </div>
                    <p className={cn(textCn('rs-subtitle-2'), styles.intro)} data-testid="ambassadors-intro">
                        Great contributions deserve recognition and support. <br className={styles.break} />
                        Here is what comes with being a&nbsp;Kotlin Ambassador.
                    </p>
                    <div className={styles.grid} data-testid="ambassadors-benefits">
                        {BENEFITS.map((benefit) => (
                            <div className={styles.card} key={benefit.id} data-testid="ambassadors-benefit-card">
                                <h3 className={cn(textCn('rs-h3'), styles.cardTitle)}>{benefit.title}</h3>
                                <p className={cn(textCn('rs-text-1'), styles.cardText)}>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
