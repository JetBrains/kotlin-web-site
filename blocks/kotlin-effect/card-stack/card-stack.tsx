import React, { FC, useLayoutEffect, useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import styles from './card-stack.module.css';

const CARDS = [0, 1, 2];
// Resting tilt for each card in the stack. The last card tilts the other way
// so its right corner peeks out from behind the card in front of it.
const CARD_TILTS_DEG = [0, 2, -4];
const EXIT_Y = '60vh';
const EXIT_ROTATION_DEG = -12;
// Scroll distance allotted to each card transition. Smaller values make a
// single trackpad flick advance one card; the snap config below locks it in.
const STEP_VH = 40;
// Extra scroll distance spent "holding" on the first and last card so the
// pinned section dwells there before/after the transitions.
const HOLD_VH = 40;

export const CardStack: FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);

    const setCardRef = (el: HTMLDivElement | null, i: number) => {
        if (el) cardsRef.current[i] = el;
    };

    useLayoutEffect(() => {
        const cards = cardsRef.current;
        if (!cards.length) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        cards.forEach((c, i) => {
            gsap.set(c, { rotation: CARD_TILTS_DEG[i] ?? 0, zIndex: cards.length - i });
        });

        if (reduceMotion) return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const steps = cards.length - 1;
            const holds = cards.length; // dwell on every card
            const totalVh = steps * STEP_VH + holds * HOLD_VH;
            const holdFrac = HOLD_VH / totalVh;
            const stepFrac = STEP_VH / totalVh;
            const holdDur = HOLD_VH / STEP_VH;

            // Snap to the start of every hold so scroll rests on each card.
            const snapPoints: number[] = [];
            let acc = 0;
            for (let i = 0; i < cards.length; i++) {
                snapPoints.push(acc);
                acc += holdFrac;
                if (i < steps) acc += stepFrac;
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: `+=${totalVh}%`,
                    pin: true,
                    scrub: 0.3,
                    snap: {
                        snapTo: snapPoints,
                        duration: { min: 0.15, max: 0.35 },
                        delay: 0,
                        ease: 'power2.out',
                    },
                },
            });

            for (let i = 0; i < steps; i++) {
                tl.to({}, { duration: holdDur });
                tl.to(cards[i], {
                    y: EXIT_Y,
                    rotation: EXIT_ROTATION_DEG,
                    opacity: 0,
                    ease: 'power2.in',
                })
                  .to(cards[i + 1], { rotation: 0, ease: 'power2.out' }, '<');
            }
            tl.to({}, { duration: holdDur });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className={styles.section}>
            <div className="ktl-layout ktl-layout--center">
                <div className="ktl-container">
                    <div className={styles.stack}>
                        {CARDS.map((i) => (
                            <div
                                key={i}
                                ref={(el) => setCardRef(el, i)}
                                className={styles.card}
                                data-test="card-stack-card"
                            >
                                content {i + 1}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
