import cn from 'classnames';

import Button from '@rescui/button';
import { useTextStyles } from '@rescui/typography';

import {
    AMBASSADOR_IMAGE_K_ELEMENT,
    AMBASSADOR_IMAGE_PLATE,
    AMBASSADOR_IMAGE_SEAL
} from '@/blocks/community/ambassadors/ambassador-images';

import styles from './badge.module.css';

// TODO(marketing): replace with the real badge-kit URL before the release (KTL-5273).
const BADGE_URL = '#';

export function Badge() {
    const textCn = useTextStyles();

    return (
        <section className={styles.badge} data-testid="kotlin-ambassador-badge">
            <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}>
                <div className={styles.card} data-testid="kotlin-ambassador-badge-card">
                    <div className={styles.cardText} data-testid="kotlin-ambassador-badge-text">
                        <div className={styles.textGroup}>
                            <h2 className={cn(textCn('rs-h2'), styles.title)} data-testid="kotlin-ambassador-badge-title">
                                Let the community know
                            </h2>
                            <p className={cn(textCn('rs-text-1', { hardness: 'hard' }), styles.text)}>
                                You&rsquo;re welcome to use the Kotlin Ambassador title and badge on your website, GitHub
                                profile, social media, and conference presentations.
                            </p>
                        </div>
                        <Button
                            mode="rock"
                            size="l"
                            href={BADGE_URL}
                            className={styles.button}
                            data-testid="kotlin-ambassador-badge-button"
                        >
                            Get your badge
                        </Button>
                    </div>
                    <div className={styles.decoration} aria-hidden="true" data-testid="kotlin-ambassador-badge-decoration">
                        <img
                            className={styles.seal}
                            src={AMBASSADOR_IMAGE_SEAL.src}
                            srcSet={AMBASSADOR_IMAGE_SEAL.srcSet}
                            alt=""
                        />
                        <img
                            className={styles.plate}
                            src={AMBASSADOR_IMAGE_PLATE.src}
                            srcSet={AMBASSADOR_IMAGE_PLATE.srcSet}
                            alt=""
                        />
                        <img
                            className={styles.flag}
                            src={AMBASSADOR_IMAGE_K_ELEMENT.src}
                            srcSet={AMBASSADOR_IMAGE_K_ELEMENT.srcSet}
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
