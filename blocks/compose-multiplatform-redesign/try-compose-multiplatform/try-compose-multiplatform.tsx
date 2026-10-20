/**
 * 05-showcase — Frame 1321314934 (node 92:1155), 1540×857 at 1540.
 * Bucket 2; crop .f2c/pages/compose-multiplatform-redesign/crops/05-showcase.png.
 * Scaffold from emit-project-page.mjs — the inside of the section is the markup step's.
 */
import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import { TRY_COMPOSE_MULTIPLATFORM_COPY } from './try-compose-multiplatform-data';

import styles from './try-compose-multiplatform.module.css';

export const TryComposeMultiplatformSection: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} id="try-compose-multiplatform" data-testid="compose-multiplatform-redesign-try-compose-multiplatform" data-section="05-showcase">
            {TRY_COMPOSE_MULTIPLATFORM_COPY.map((item) => (
                <p key={item.id} className={cn(styles.text, textCn('rs-text-1'))}>
                    {item.text}
                </p>
            ))}
        </section>
    );
};
