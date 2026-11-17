import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './how-to-become.module.css';

export const HowToBecome: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.section} data-testid="ambassadors-how-to-become">
            <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}>
                <div className={styles.layer} aria-hidden="true" data-testid="ambassadors-program-decoration">
                    <img
                        className={cn(styles.item, styles.creatorBadge)}
                        src="/images/community/ambassadors/badge-creator.webp"
                        alt=""
                    />
                </div>
                <div className={styles.heading}>
                    <h2 className={cn(textCn('rs-h2'), styles.title)} data-testid="ambassadors-how-title">
                        How to become a Kotlin Ambassador
                    </h2>
                    <div className={cn(textCn('rs-text-1'), styles.text)} data-testid="ambassadors-how-text">
                        <p className={styles.paragraph}>
                            The Kotlin Ambassadors Program is invitation-based. We invite community members who stand
                            out for their technical expertise and meaningful contributions to the Kotlin community.
                        </p>
                        <p className={styles.paragraph}>
                            Candidates are identified by the Kotlin team or nominated by existing ambassadors. The
                            program does not accept applications or self-nominations.
                        </p>
                    </div>
                </div>
                <blockquote className={styles.quoteCard} data-testid="ambassadors-quote-card">
                    <div className={styles.layer} aria-hidden="true" data-testid="ambassadors-quote-decoration">
                        <img
                            className={cn(styles.item, styles.educatorBadge)}
                            src="/images/community/ambassadors/badge-educator.webp"
                            alt=""
                        />
                        <img
                            className={cn(styles.item, styles.ambassadorPlate)}
                            src="/images/community/ambassadors/plate-ambassador.webp"
                            alt=""
                        />
                    </div>
                    <p className={cn(textCn('rs-subtitle-2'), styles.quoteText)}>
                        Keep sharing your knowledge, building great things, and making a difference in the Kotlin
                        community. Your contributions matter.
                    </p>
                </blockquote>
            </div>
        </section>
    );
};
