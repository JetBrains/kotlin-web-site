import React, { FC } from 'react';
import cn from 'classnames';

import { useTextStyles } from '@rescui/typography';

import styles from './hero-screen.module.css';
import { HeroVideo } from '@/blocks/kotlin-effect/hero-screen/hero-video/hero-video';
import NeonHoverTitle from '@/blocks/kotlin-effect/hero-screen/neon-title/neon-title';

export const HeroScreen: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.section}>

            <div className="ktl-layout ktl-layout--center">
                <div className="ktl-container">

                    <div className={styles.textContainer}>
                        <NeonHoverTitle
                            text={'The Kotlin Effect'}
                            className={styles.neonTitle}
                            introAnimation
                        />
                        <h2 className={cn(textCn('rs-subtitle-1'), styles.subtitle)}>Write less. Do more. Enjoy the
                            process.</h2>
                        <p className={cn(textCn('rs-subtitle-2'), styles.text)}>A programming language designed to
                            reduce friction and help teams move faster.</p>
                    </div>

                    <HeroVideo />

                </div>
            </div>
        </section>
    );
};
