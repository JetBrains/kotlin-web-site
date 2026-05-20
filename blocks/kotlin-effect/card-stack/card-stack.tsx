import React, { FC, useLayoutEffect, useRef, useState } from 'react';

import cn from 'classnames';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useTextStyles } from '@rescui/typography';

import styles from './card-stack.module.css';

const CARD_TILTS_DEG = [0, 2, -4];
const FIXED_HEADER_HEIGHT = 64;
const CARD_CONTENT_HEIGHT = 620;
const SECTION_VERTICAL_PADDING = 140 + 96;
const CARD_VERTICAL_PADDING = 12 * 2;
const MIN_STACK_VIEWPORT_HEIGHT = FIXED_HEADER_HEIGHT + CARD_CONTENT_HEIGHT + SECTION_VERTICAL_PADDING + CARD_VERTICAL_PADDING;
const EXIT_Y = '100vh';
const EXIT_ROTATION_DEG = -12;
const SCRUB_SMOOTHING = 2;
const SNAP_DELAY = 0.06;
const SNAP_MIN_DURATION = 0.2;
const SNAP_MAX_DURATION = 0.4;

export const CardStack: FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const card1Ref = useRef<HTMLDivElement>(null);
    const card2Ref = useRef<HTMLDivElement>(null);
    const card3Ref = useRef<HTMLDivElement>(null);
    const [isStackEnabled, setIsStackEnabled] = useState(false);

    useLayoutEffect(() => {
        const updateStackAvailability = () => {
            setIsStackEnabled(window.innerHeight >= MIN_STACK_VIEWPORT_HEIGHT);
        };

        updateStackAvailability();
        window.addEventListener('resize', updateStackAvailability);

        return () => {
            window.removeEventListener('resize', updateStackAvailability);
        };
    }, []);

    useLayoutEffect(() => {
        const cards = [card1Ref.current!, card2Ref.current!, card3Ref.current!];

        const resetCards = () => {
            gsap.set(cards, { clearProps: 'transform,opacity,zIndex' });
        };

        resetCards();

        if (!isStackEnabled) return;

        gsap.registerPlugin(ScrollTrigger);

        cards.forEach((c, i) => {
            gsap.set(c, { rotation: CARD_TILTS_DEG[i] ?? 0, zIndex: cards.length - i });
        });

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: `top top+=${FIXED_HEADER_HEIGHT}`,
                    end: () => `+=${(window.innerHeight - FIXED_HEADER_HEIGHT) * cards.length}`,
                    pin: true,
                    scrub: SCRUB_SMOOTHING,
                    snap: {
                        snapTo: 1 / (cards.length - 1),
                        duration: { min: SNAP_MIN_DURATION, max: SNAP_MAX_DURATION },
                        delay: SNAP_DELAY,
                        ease: 'power1.out'
                    },
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            });

            cards.slice(0, -1).forEach((card, i) => {
                tl.to(card, {
                    y: EXIT_Y,
                    rotation: EXIT_ROTATION_DEG,
                    ease: 'none',
                    force3D: true,
                    keyframes: {
                        '50%': { opacity: 1 },
                        '100%': { opacity: 0 }
                    }
                }).to(cards[i + 1], {
                    rotation: 0,
                    ease: 'none',
                    force3D: true
                }, '<');
            });
        }, sectionRef);

        return () => {
            ctx.revert();
            resetCards();
        };
    }, [isStackEnabled]);

    const textCn = useTextStyles();

    return (
        <section ref={sectionRef} className={cn(styles.section, isStackEnabled && styles.sectionStack)}>
            <div className="ktl-layout ktl-layout--center">
                <div className="ktl-container">
                    <div className={cn(styles.stack, isStackEnabled && styles.stackAnimated)}>
                        <div
                            ref={card1Ref}
                            className={styles.card}
                            data-test="card-stack-card"
                        >
                            <div className={styles.cardInner}>
                                <div className={styles.cardContent}>
                                    <h2 className={cn(textCn('rs-h1'), styles.cardTitle)}>The Kotlin Effect in Real
                                        Life</h2>
                                    <p className={cn(textCn('rs-subtitle-2'), styles.cardSubtitle)}>
                                        What happens when Kotlin’s logic goes beyond code? In
                                        this video, we bring the Kotlin Effect into everyday life – making things more
                                        concise,
                                        efficient, and fun.
                                    </p>
                                </div>

                                <div className={styles.videoPlaceholder}>
                                    video
                                </div>
                            </div>

                        </div>
                        <div
                            ref={card2Ref}
                            className={styles.card}
                            data-test="card-stack-card"
                        >
                            <div className={styles.cardInner}>
                                <div className={styles.cardContent}>
                                    <h2 className={textCn('rs-h1')}>The Kotlin Effect in Action</h2>
                                    <p className={textCn('rs-subtitle-2')}>
                                        Step into a pixel-art world where Kodee battles bugs,
                                        breaks through boilerplate, and rises from a gray legacy underworld to a vibrant
                                        Kotlin-powered future.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div
                            ref={card3Ref}
                            className={cn(styles.card, styles.cardGradient)}
                            data-test="card-stack-card"
                        >
                            <div className={styles.cardInner}>
                                <div className={styles.cardContent}>
                                    <h2 className={textCn('rs-h1')}>Make the Kotlin Effect Yours</h2>
                                    <p className={textCn('rs-subtitle-2')}>
                                        Move from fundamentals to real-world development – across mobile, backend, web,
                                        and desktop applications.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
