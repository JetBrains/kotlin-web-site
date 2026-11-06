import React, { FC } from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { ArrowRightIcon } from '@rescui/icons';
import { useTextStyles } from '@rescui/typography';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import { CONTACT_SALES_URL } from '../constants';

import shared from '../kotlin-lts.module.css';
import styles from './cta.module.css';

export const Cta: FC = () => {
    const textCn = useTextStyles();
    const buttonSize = useMS() ? 'm' : 'l';

    return (
        <section className={cn(shared.section, styles.cta)} data-testid="lts-cta">
            <div className={cn('ktl-layout', 'ktl-layout--center', styles.content)}>
                <h2 className={cn(textCn('rs-h1'), shared.title)} data-testid="lts-cta-title">
                    Secure your Kotlin stack
                </h2>
                <p className={cn(textCn('rs-subtitle-2', { hardness: 'average' }), styles.text)}>
                    Talk to our team about supported versions, SLAs, and pricing for your organization.
                </p>
                <Button
                    mode="rock"
                    size={buttonSize}
                    icon={<ArrowRightIcon />}
                    iconPosition="right"
                    className={styles.button}
                    href={CONTACT_SALES_URL}
                    data-testid="lts-cta-contact-sales"
                >
                    Contact sales
                </Button>
            </div>
        </section>
    );
};
