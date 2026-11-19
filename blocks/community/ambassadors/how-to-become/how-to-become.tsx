import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './how-to-become.module.css';

export const HowToBecome: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.section} data-testid="ambassadors-how-to-become">
            <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}>
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
                            className={styles.creatorBadge}
                            src="/images/community/ambassadors/badge-creator.webp"
                            srcSet="/images/community/ambassadors/badge-creator.webp 1x, /images/community/ambassadors/badge-creator@2x.webp 2x, /images/community/ambassadors/badge-creator@3x.webp 3x"
                            alt=""
                        />
                        <img
                            className={styles.educatorBadge}
                            src="/images/community/ambassadors/badge-educator.webp"
                            srcSet="/images/community/ambassadors/badge-educator.webp 1x, /images/community/ambassadors/badge-educator@2x.webp 2x, /images/community/ambassadors/badge-educator@3x.webp 3x"
                            alt=""
                        />
                        <img
                            className={styles.ambassadorPlate}
                            src="/images/community/ambassadors/plate-ambassador.webp"
                            srcSet="/images/community/ambassadors/plate-ambassador.webp 1x, /images/community/ambassadors/plate-ambassador@2x.webp 2x, /images/community/ambassadors/plate-ambassador@3x.webp 3x"
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
