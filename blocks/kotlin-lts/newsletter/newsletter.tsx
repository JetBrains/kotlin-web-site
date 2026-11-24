import React, { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { ArrowRightIcon } from '@rescui/icons';
import { useTextStyles } from '@rescui/typography';

import { NEWSLETTER_URL } from '../constants';
import mailGraphic from '@/blocks/education/subscription-form/mail-icon.svg';
import styles from './newsletter.module.css';

export const Newsletter: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.banner} aria-labelledby="lts-newsletter-title" data-testid="lts-newsletter">
            <div className={cn('ktl-layout', 'ktl-layout--center', styles.content)}>
                <div className={styles.artwork} aria-hidden="true">
                    <Image src={mailGraphic} alt="" className={styles.image} />
                </div>
                <div className={styles.copy}>
                    <div className={styles.intro}>
                        <h2 id="lts-newsletter-title" className={cn(textCn('rs-h3'), styles.title)}>
                            Kotlin Security Newsletter
                        </h2>
                    </div>
                    <p className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.description)}>
                        Fixed CVEs, affected versions, and dependency updates in a free, regular digest.
                    </p>
                </div>
                <Button
                    mode="classic"
                    href={NEWSLETTER_URL}
                    icon={<ArrowRightIcon />}
                    iconPosition="right"
                    className={styles.action}
                >
                    Track Kotlin security fixes
                </Button>
            </div>
        </section>
    );
};
