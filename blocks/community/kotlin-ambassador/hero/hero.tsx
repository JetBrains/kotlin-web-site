import cn from 'classnames';

import { useTextStyles } from '@rescui/typography';

import { AMBASSADOR_IMAGE_SIGN } from '@/blocks/community/ambassadors/ambassador-images';
import { Invitation } from '@/blocks/community/kotlin-ambassador/invitation/invitation';

import styles from './hero.module.css';

export function Hero() {
    const textCn = useTextStyles();

    return (
        <section className={styles.hero} data-testid="kotlin-ambassador-hero">
            <div
                className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}
                data-testid="kotlin-ambassador-hero-content"
            >
                <div className={styles.heading} data-testid="kotlin-ambassador-heading">
                    <div className={styles.signGroup}>
                        <img
                            className={styles.sign}
                            src={AMBASSADOR_IMAGE_SIGN.src}
                            alt="Kotlin Ambassadors sign"
                            data-testid="kotlin-ambassador-sign"
                        />
                        <h2 className={cn(textCn('rs-h2'), styles.programTitle)} data-testid="kotlin-ambassador-program-title">
                            Kotlin Ambassadors Program
                        </h2>
                    </div>
                    <div className={styles.titleGroup}>
                        <h1 className={cn(textCn('rs-hero'), styles.title)} data-testid="kotlin-ambassador-title">
                            Congratulations!
                        </h1>
                        <p className={cn(textCn('rs-subtitle-2'), styles.subtitle)} data-testid="kotlin-ambassador-subtitle">
                            You&rsquo;re invited to become<br className={styles.break} />a Kotlin Ambassador.
                        </p>
                    </div>
                </div>
                <Invitation />
            </div>
        </section>
    );
}
