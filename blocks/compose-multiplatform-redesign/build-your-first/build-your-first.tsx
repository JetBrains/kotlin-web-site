/**
 * 08-showcase — Frame 1195 (node 92:1191), 1144×373 at 1540.
 * Bucket 2; crop .f2c/pages/compose-multiplatform-redesign/crops/08-showcase.png.
 * Scaffold from emit-project-page.mjs — the inside of the section is the markup step's.
 */
import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import { BUILD_YOUR_FIRST_COPY } from './build-your-first-data';

import styles from './build-your-first.module.css';

export const BuildYourFirstSection: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} id="build-your-first" data-testid="compose-multiplatform-redesign-build-your-first" data-section="08-showcase">
            {BUILD_YOUR_FIRST_COPY.map((item) => (
                <p key={item.id} className={cn(styles.text, textCn('rs-text-1'))}>
                    {item.text}
                </p>
            ))}
        </section>
    );
};
