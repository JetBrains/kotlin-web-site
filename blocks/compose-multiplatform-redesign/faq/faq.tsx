/**
 * 07-faq — Frame 6479 (node 92:1185), 1540×353 at 1540.
 * Bucket 1; crop .f2c/pages/compose-multiplatform-redesign/crops/07-faq.png.
 * Scaffold from emit-project-page.mjs — the inside of the section is the markup step's.
 */
import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import { FAQ_COPY } from './faq-data';

import styles from './faq.module.css';

export const FaqSection: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} id="faq" data-testid="compose-multiplatform-redesign-faq" data-section="07-faq">
            {FAQ_COPY.map((item) => (
                <p key={item.id} className={cn(styles.text, textCn('rs-text-1'))}>
                    {item.text}
                </p>
            ))}
        </section>
    );
};
