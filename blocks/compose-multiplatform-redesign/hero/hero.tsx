/**
 * 01-hero — Frame 1883 (node 92:1039), 1144×902 at 1540.
 * Bucket 2; crop .f2c/pages/compose-multiplatform-redesign/crops/01-hero.png.
 * Scaffold from emit-project-page.mjs — the inside of the section is the markup step's.
 */
import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import { HERO_COPY } from './hero-data';

import styles from './hero.module.css';

export const HeroSection: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} id="hero" data-testid="compose-multiplatform-redesign-hero" data-section="01-hero">
            {HERO_COPY.map((item) => (
                <p key={item.id} className={cn(styles.text, textCn('rs-text-1'))}>
                    {item.text}
                </p>
            ))}
        </section>
    );
};
