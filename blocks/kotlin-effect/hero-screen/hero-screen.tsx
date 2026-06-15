import React, { FC, useLayoutEffect, useRef } from 'react';
import cn from 'classnames';
import gsap from 'gsap';

import { useTextStyles } from '@rescui/typography';

import styles from './hero-screen.module.css';
import { HeroVideo } from '@/blocks/kotlin-effect/hero-screen/hero-video/hero-video';
import NeonHoverTitle from '@/blocks/kotlin-effect/hero-screen/neon-title/neon-title';
import { Button } from '@rescui/button';

// import { useTL } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints';

export const HeroScreen: FC = () => {
    const textCn = useTextStyles();
    const textContainerRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from([subtitleRef.current, textRef.current, buttonRef.current], {
                opacity: 0,
                y: 32,
                duration: 1.5,
                ease: 'power3.out',
                stagger: 0.16,
                delay: 0.35
            });
        }, textContainerRef);

        return () => ctx.revert();
    }, []);

    // const isTL = useTL();

    return (
        <section className={styles.section}>
            <div className="ktl-layout-v2 ktl-layout--center">
                <div className={styles.wrapper}>
                    <div ref={textContainerRef} className={styles.textContainer}>
                        <NeonHoverTitle text={'The Kotlin Effect'} className={styles.neonTitle} introAnimation />
                        <h2 ref={subtitleRef} className={cn(textCn('rs-subtitle-1'), styles.subtitle)}>
                            Write less. <br className={styles.mobileBr} />
                            Do more. <br className={styles.mobileBr} />
                            Enjoy the process.
                            <br className={styles.mobileBr} />
                        </h2>
                        <p ref={textRef} className={cn(textCn('rs-subtitle-2'), styles.text)}>
                            A programming language designed to reduce friction
                            <br /> and help teams move faster.
                        </p>

                        <div className={styles.buttons} ref={buttonRef}>
                            <Button size="l" mode={'rock'} href={'https://play.kotlinlang.org/'} target={'_blank'} rel={'noopener noreferrer'}>
                                Try Kotlin
                            </Button>
                            <Button size="l" mode={'outline'} href={'/'}>
                                Learn more
                            </Button>
                        </div>
                    </div>

                    <div className={styles.videoContainer}>
                        <HeroVideo />
                    </div>
                </div>
            </div>
        </section>
    );
};
