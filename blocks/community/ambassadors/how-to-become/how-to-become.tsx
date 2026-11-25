import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import {
    AMBASSADOR_IMAGE_BADGE_CREATOR,
    AMBASSADOR_IMAGE_BADGE_EDUCATOR,
    AMBASSADOR_IMAGE_PLATE
} from '@/blocks/community/ambassadors/ambassador-images';

import styles from './how-to-become.module.css';

export function HowToBecome() {
    const textCn = useTextStyles();

    return (
        <section className={styles.section} data-testid="ambassadors-how-to-become">
            <div
                className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}
                data-testid="ambassadors-how-content"
            >
                <div className={styles.heading}>
                    <h2 className={cn(textCn('rs-h2'), styles.title)} data-testid="ambassadors-how-title">
                        How to become a Kotlin Ambassador
                    </h2>
                    <div className={cn(textCn('rs-text-1'), styles.text)} data-testid="ambassadors-how-text">
                        <p className={styles.paragraph}>The Kotlin Ambassadors Program is invitation-based.</p>
                        <p className={styles.paragraph}>
                            We invite community members who stand out for their technical expertise and meaningful
                            contributions to the Kotlin ecosystem.
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
                            src={AMBASSADOR_IMAGE_BADGE_CREATOR.src}
                            srcSet={AMBASSADOR_IMAGE_BADGE_CREATOR.srcSet}
                            alt=""
                        />
                        <img
                            className={styles.educatorBadge}
                            src={AMBASSADOR_IMAGE_BADGE_EDUCATOR.src}
                            srcSet={AMBASSADOR_IMAGE_BADGE_EDUCATOR.srcSet}
                            alt=""
                        />
                        <img
                            className={styles.ambassadorPlate}
                            src={AMBASSADOR_IMAGE_PLATE.src}
                            srcSet={AMBASSADOR_IMAGE_PLATE.srcSet}
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
}
