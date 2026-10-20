/**
 * 04-format-cards — Frame 1321315000 (node 92:1127), 1144×481 at 1540.
 * Bucket 2; crop .f2c/pages/compose-multiplatform-redesign/crops/04-format-cards.png.
 * Scaffold from emit-project-page.mjs — the inside of the section is the markup step's.
 */
import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import { SUPPORTED_PLATFORMS_COPY } from './supported-platforms-data';

import styles from './supported-platforms.module.css';

export const SupportedPlatformsSection: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} id="supported-platforms" data-testid="compose-multiplatform-redesign-supported-platforms" data-section="04-format-cards">
            {SUPPORTED_PLATFORMS_COPY.map((item) => (
                <p key={item.id} className={cn(styles.text, textCn('rs-text-1'))}>
                    {item.text}
                </p>
            ))}
        </section>
    );
};
