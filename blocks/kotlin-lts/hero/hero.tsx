import React, { FC } from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { Tag, presets } from '@rescui/tag';
import { ArrowRightIcon } from '@rescui/icons';
import { useTextStyles } from '@rescui/typography';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import { CONTACT_SALES_URL, SECTION_IDS } from '../constants';

import shared from '../kotlin-lts.module.css';
import styles from './hero.module.css';

export const Hero: FC = () => {
    const textCn = useTextStyles();
    const buttonSize = useMS() ? 'm' : 'l';

    return (
        <section className={styles.hero} data-testid="lts-hero">
            <div className={cn('ktl-layout', 'ktl-layout--center', styles.content)}>
                <Tag
                    size="m"
                    isUppercase
                    icon={<span className={styles.dot} />}
                    className={styles.eyebrow}
                    {...presets['outline-dark']}
                >
                    Commercial subscription
                </Tag>

                <h1 className={cn(textCn('rs-hero'), styles.title)} data-testid="lts-hero-title">
                    Kotlin <span className={shared.gradientText}>Long&#8209;Term Support</span>
                </h1>

                <p className={cn(textCn('rs-subtitle-1'), styles.lead)} data-testid="lts-hero-subtitle">
                    Keep your Kotlin stack secure and reliable with targeted patch updates&nbsp;– minimize upgrade
                    effort.
                </p>

                <div className={styles.actions}>
                    <Button
                        mode="rock"
                        size={buttonSize}
                        icon={<ArrowRightIcon />}
                        iconPosition="right"
                        className={styles.button}
                        href={CONTACT_SALES_URL}
                        data-testid="lts-hero-contact-sales"
                    >
                        Contact sales
                    </Button>
                    <Button
                        mode="outline"
                        size={buttonSize}
                        href={`#${SECTION_IDS.benefits}`}
                        className={styles.button}
                        data-testid="lts-hero-benefits-link"
                    >
                        What's included
                    </Button>
                </div>
            </div>
        </section>
    );
};
