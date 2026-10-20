/**
 * 06-content — Frame 1321314935 (node 92:1172), 1540×540 at 1540.
 * Bucket 2; crop .f2c/pages/compose-multiplatform-redesign/crops/06-content.png.
 * Scaffold from emit-project-page.mjs — the inside of the section is the markup step's.
 */
import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import { ALEX_ASKEROV_COPY } from './alex-askerov-data';

import styles from './alex-askerov.module.css';

export const AlexAskerovSection: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} id="alex-askerov" data-testid="compose-multiplatform-redesign-alex-askerov" data-section="06-content">
            {ALEX_ASKEROV_COPY.map((item) => (
                <p key={item.id} className={cn(styles.text, textCn('rs-text-1'))}>
                    {item.text}
                </p>
            ))}
        </section>
    );
};
