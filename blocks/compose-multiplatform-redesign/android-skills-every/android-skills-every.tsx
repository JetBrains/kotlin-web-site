/**
 * 02-content — Frame 1321314969 (node 92:1066), 1144×988 at 1540.
 * Bucket 2; crop .f2c/pages/compose-multiplatform-redesign/crops/02-content.png.
 * Scaffold from emit-project-page.mjs — the inside of the section is the markup step's.
 */
import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import { ANDROID_SKILLS_EVERY_COPY } from './android-skills-every-data';

import styles from './android-skills-every.module.css';

export const AndroidSkillsEverySection: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} id="android-skills-every" data-testid="compose-multiplatform-redesign-android-skills-every" data-section="02-content">
            {ANDROID_SKILLS_EVERY_COPY.map((item) => (
                <p key={item.id} className={cn(styles.text, textCn('rs-text-1'))}>
                    {item.text}
                </p>
            ))}
        </section>
    );
};
