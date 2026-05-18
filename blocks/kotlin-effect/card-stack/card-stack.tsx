import React, { FC, useLayoutEffect, useRef } from 'react';

import cn from 'classnames';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

import styles from './card-stack.module.css';

const CARD_TILTS_DEG = [0, 2, -4];
const EXIT_Y = '60vh';
const EXIT_ROTATION_DEG = -12;
const TRANSITION_DURATION = 0.7;

export const CardStack: FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);

    const setCardRef = (el: HTMLDivElement | null, i: number) => {
        if (el) cardsRef.current[i] = el;
    };

    useLayoutEffect(() => {
        const cards = cardsRef.current;
        if (!cards.length) return;

        cards.forEach((c, i) => {
            gsap.set(c, { rotation: CARD_TILTS_DEG[i] ?? 0, zIndex: cards.length - i });
        });

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.registerPlugin(ScrollTrigger, Observer);

        let currentIndex = 0;
        let animating = false;

        const goTo = (target: number) => {
            if (animating || target < 0 || target >= cards.length || target === currentIndex) return;
            animating = true;
            const from = currentIndex;
            currentIndex = target;
            const tl = gsap.timeline({ onComplete: () => { animating = false; } });

            if (target > from) {
                // forward: current card exits, target becomes upright
                tl.to(cards[from], {
                    y: EXIT_Y, rotation: EXIT_ROTATION_DEG, opacity: 0,
                    duration: TRANSITION_DURATION, ease: 'power2.in',
                }, 0).to(cards[target], {
                    rotation: 0,
                    duration: TRANSITION_DURATION, ease: 'power2.out',
                }, 0);
            } else {
                // back: target slides back to upright, current card retreats to its resting tilt
                tl.to(cards[target], {
                    y: 0, rotation: 0, opacity: 1,
                    duration: TRANSITION_DURATION, ease: 'power2.out',
                }, 0).to(cards[from], {
                    rotation: CARD_TILTS_DEG[from] ?? 0,
                    duration: TRANSITION_DURATION, ease: 'power2.in',
                }, 0);
            }
        };

        const ctx = gsap.context(() => {
            let observer: Observer | null = null;

            const createObserver = () => {
                observer?.kill();
                observer = Observer.create({
                    target: window,
                    type: 'wheel,touch',
                    preventDefault: true,
                    tolerance: 10,
                    onDown: () => {
                        if (currentIndex >= cards.length - 1) {
                            observer?.kill();
                            observer = null;
                            return;
                        }
                        goTo(currentIndex + 1);
                    },
                    onUp: () => {
                        if (currentIndex <= 0) {
                            observer?.kill();
                            observer = null;
                            return;
                        }
                        goTo(currentIndex - 1);
                    },
                });
            };

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top top',
                end: '+=100%',
                pin: true,
                onEnter: createObserver,
                onEnterBack: createObserver,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className={styles.section}>
            <div className="ktl-layout ktl-layout--center">
                <div className="ktl-container">
                    <div className={styles.stack}>
                        <div
                            ref={(el) => setCardRef(el, 0)}
                            className={styles.card}
                            data-test="card-stack-card"
                        >
                            content 1
                        </div>
                        <div
                            ref={(el) => setCardRef(el, 1)}
                            className={styles.card}
                            data-test="card-stack-card"
                        >
                            content 2
                        </div>
                        <div
                            ref={(el) => setCardRef(el, 2)}
                            className={cn(styles.card, styles.cardGradient)}
                            data-test="card-stack-card"
                        >
                            content 3
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
