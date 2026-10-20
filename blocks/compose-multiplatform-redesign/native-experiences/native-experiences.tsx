/**
 * 03-content — Frame 1321314961 (node 92:1093), 1144×1853.4736328125 at 1540.
 * Bucket 2; crop .f2c/pages/compose-multiplatform-redesign/crops/03-content.png.
 * Scaffold from emit-project-page.mjs — the inside of the section is the markup step's.
 */
import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import { NATIVE_EXPERIENCES_COPY } from './native-experiences-data';

import styles from './native-experiences.module.css';

export const NativeExperiencesSection: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} id="native-experiences" data-testid="compose-multiplatform-redesign-native-experiences" data-section="03-content">
            {NATIVE_EXPERIENCES_COPY.map((item) => (
                <p key={item.id} className={cn(styles.text, textCn('rs-text-1'))}>
                    {item.text}
                </p>
            ))}
        </section>
    );
};
