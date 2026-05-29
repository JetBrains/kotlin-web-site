import React, { FC, useLayoutEffect, useRef, useState } from 'react';

import cn from 'classnames';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Image from 'next/image';

import { useTextStyles, createTextCn } from '@rescui/typography';
import { Tag, presets as basePresets } from '@rescui/tag';
import { RocketIcon, PresentIcon, WinIcon } from '@rescui/icons';
import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';
import { BREAKPOINTS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import styles from './card-stack.module.css';

import gameScreen1 from './screenshots/game-screenshot-1.webp';
import gameScreen2 from './screenshots/game-screenshot-2.webp';
import { Button } from '@rescui/button';

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
            setIsStackEnabled(
                window.innerWidth > BREAKPOINTS.DS && window.innerHeight >= MIN_STACK_VIEWPORT_HEIGHT
            );
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
    const darkTextCn = createTextCn('dark');

    const tagPresets = {
        ...basePresets,
        light: { color: 'white', backgroundColor: '#19191C' },
        dark: { color: '#19191C', backgroundColor: '#19191C1A' }
    };

    return (
        <section ref={sectionRef} className={cn(styles.section, isStackEnabled && styles.sectionStack)}>
            <div className="ktl-layout-v2 ktl-layout--center">
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
                                <YoutubePlayer id={'7YJyPXjLdug'} />
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
                                <h2 className={cn(textCn('rs-h1'), styles.cardTitle)}>The Kotlin Effect in Action</h2>
                                <p className={cn(textCn('rs-subtitle-2'), styles.cardSubtitle)}>
                                    Step into a pixel-art world where Kodee battles bugs,
                                    breaks through boilerplate, and rises from a gray legacy underworld to a vibrant
                                    Kotlin-powered future.
                                </p>
                            </div>

                            <div className={styles.tagsContainer}>
                                <Tag {...tagPresets.light} size={'m'} icon={<RocketIcon className={styles.icon} />}>Survive
                                    the chaos</Tag>
                                <Tag {...tagPresets.light} size={'m'} icon={<PresentIcon className={styles.icon} />}>Unlock
                                    Kotlin-inspired power-ups</Tag>
                                <Tag {...tagPresets.light} size={'m'} icon={<WinIcon className={styles.icon} />}>Climb
                                    the leaderboard</Tag>
                            </div>

                            <div className={styles.screenshots}>
                                <div className={styles.screenshot}>
                                    <Image className={styles.screenshotImg} src={gameScreen1}
                                           alt={'Game screenshot 1'} />
                                </div>
                                <div className={styles.screenshot}>
                                    <Image className={styles.screenshotImg} src={gameScreen2}
                                           alt={'Game screenshot 2'} />
                                </div>
                            </div>

                            <div>
                                <Button size="l" mode={'rock'}>Play the Game</Button>
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
                                <h2 className={cn(textCn('rs-h1'), styles.cardTitle, styles.textInverted)}>Make the
                                    Kotlin Effect Yours</h2>
                                <p className={cn(textCn('rs-subtitle-2'), styles.cardSubtitle, styles.textInverted)}>
                                    Move from fundamentals to real-world development – across mobile, backend, web,
                                    and desktop applications.
                                </p>
                            </div>

                            <div className={styles.tagsContainer}>
                                <Tag {...tagPresets.dark} size={'m'} icon={<RocketIcon className={styles.iconDark} />}>
                                    Exclusive anniversary offer: Get free access to select Kotlin courses on Hyperskill!
                                </Tag>
                                <p className={cn(textCn('rs-text-2'), styles.tagLinksContainer)}>
                                    <a className={textCn('rs-link', { mode: 'standalone' })} href="#">
                                        Start Learning
                                    </a>
                                    <a className={textCn('rs-link', { mode: 'standalone' })} href="#">
                                        See All Courses
                                    </a>

                                </p>
                            </div>

                            <div className={styles.linksGrid}>
                                <div className={styles.linksContainer}>
                                    <h3 className={cn(darkTextCn('rs-h3'), styles.linksSubtitle)}>Get started</h3>
                                    <ul className={cn(textCn('rs-ul'), styles.linksUl)}>
                                        <li className={styles.linksLi}>
                                            <a href="" className={darkTextCn('rs-link', { mode: 'clear' })}>Introduction
                                                to Kotlin</a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a href="" className={darkTextCn('rs-link', { mode: 'clear' })}>Introduction
                                                to Kotlin</a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a href="" className={darkTextCn('rs-link', { mode: 'clear' })}>Introduction
                                                to Kotlin</a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a href="" className={darkTextCn('rs-link', { mode: 'clear' })}>Introduction
                                                to Kotlin</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={styles.linksContainer}>
                                    <h3 className={cn(darkTextCn('rs-h3'), styles.linksSubtitle)}>Build real
                                        projects</h3>
                                    <ul className={cn(textCn('rs-ul'), styles.linksUl)}>
                                        <li className={styles.linksLi}>
                                            <a href="" className={darkTextCn('rs-link', { mode: 'clear' })}>Introduction
                                                to Kotlin</a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a href="" className={darkTextCn('rs-link', { mode: 'clear' })}>Introduction
                                                to Kotlin</a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a href="" className={darkTextCn('rs-link', { mode: 'clear' })}>Introduction
                                                to Kotlin</a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a href="" className={darkTextCn('rs-link', { mode: 'clear' })}>Introduction
                                                to Kotlin</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={styles.linksContainer}>
                                    <h3 className={cn(darkTextCn('rs-h3'), styles.linksSubtitle)}>Explore professional
                                        tracks</h3>
                                    <ul className={cn(textCn('rs-ul'), styles.linksUl)}>
                                        <li className={styles.linksLi}>
                                            <a href="" className={darkTextCn('rs-link', { mode: 'clear' })}>Introduction
                                                to Kotlin</a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a href="" className={darkTextCn('rs-link', { mode: 'clear' })}>Introduction
                                                to Kotlin</a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a href="" className={darkTextCn('rs-link', { mode: 'clear' })}>Introduction
                                                to Kotlin</a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a href="" className={darkTextCn('rs-link', { mode: 'clear' })}>Introduction
                                                to Kotlin</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <Button size="l" mode={'rock'}>Build Your First Project</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
