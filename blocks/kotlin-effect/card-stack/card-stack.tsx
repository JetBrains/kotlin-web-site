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
import { ThemeProvider } from '@rescui/ui-contexts';

const CARD_TILTS_DEG = [0, 2, -4];
const FIXED_HEADER_HEIGHT = 64;
const CARD_CONTENT_HEIGHT = 620;
const SECTION_VERTICAL_PADDING = 48;
const CARD_VERTICAL_PADDING = 12 * 2;
const MIN_STACK_VIEWPORT_HEIGHT = FIXED_HEADER_HEIGHT + CARD_CONTENT_HEIGHT + SECTION_VERTICAL_PADDING + CARD_VERTICAL_PADDING;
const EXIT_Y = '100vh';
const EXIT_ROTATION_DEG = -12;
const SCRUB_SMOOTHING = 2;
const SNAP_DELAY = 1;
const SNAP_MIN_DURATION = 0.5;
const SNAP_MAX_DURATION = 1;

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
                    end: 'bottom top',
                    pin: true,
                    scrub: SCRUB_SMOOTHING,
                    snap: {
                        snapTo: 1 / (cards.length - 1),
                        duration: { min: SNAP_MIN_DURATION, max: SNAP_MAX_DURATION },
                        delay: SNAP_DELAY,
                        ease: 'power1.out'
                    },
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
    const darkLinkCn = createTextCn('light');

    const tagPresets = {
        ...basePresets,
        light: { color: 'white', backgroundColor: '#19191C' }
    };

    return (
        <section ref={sectionRef} className={cn(styles.section, isStackEnabled && styles.sectionStack)}>
            <div className="ktl-layout-v2 ktl-layout--center">
                <div className={cn(styles.stack, isStackEnabled && styles.stackAnimated)}>
                    <div
                        ref={card1Ref}
                        className={styles.card}
                        data-test="card-stack-card"
                        id={'kotlin-effect-in-real-life'}
                    >
                        <div className={styles.cardInner}>
                            <div className={styles.cardContent}>
                                <h2 className={cn(textCn('rs-h1'), styles.cardTitle)}>
                                    The Kotlin Effect in Real Life
                                </h2>
                                <p className={cn(textCn('rs-subtitle-2'), styles.cardSubtitle)}>
                                    What happens when Kotlin’s logic goes beyond code? In this video, we bring the
                                    Kotlin Effect into everyday life – making things more concise, efficient, and fun.
                                </p>
                            </div>

                            <div className={styles.videoPlaceholder}>
                                <YoutubePlayer id={'4Qey8yExPNg'} />
                            </div>
                        </div>
                    </div>
                    <div ref={card2Ref} className={styles.card} data-test="card-stack-card" id={'kotlin-effect-action'}>
                        <div className={styles.cardInner}>
                            <div className={styles.cardContent}>
                                <h2 className={cn(textCn('rs-h1'), styles.cardTitle)}>The Kotlin Effect in Action</h2>
                                <p className={cn(textCn('rs-subtitle-2'), styles.cardSubtitle)}>
                                    Step into a pixel-art world where Kodee battles bugs, breaks through boilerplate,
                                    and rises from a gray legacy underworld to a vibrant Kotlin-powered future.
                                </p>
                            </div>

                            <div className={styles.tagsContainer}>
                                <Tag {...tagPresets.light} size={'m'} icon={<RocketIcon className={styles.icon} />}>
                                    Survive the chaos
                                </Tag>
                                <Tag {...tagPresets.light} size={'m'} icon={<PresentIcon className={styles.icon} />}>
                                    Unlock Kotlin-inspired power-ups
                                </Tag>
                                <Tag {...tagPresets.light} size={'m'} icon={<WinIcon className={styles.icon} />}>
                                    Climb the leaderboard
                                </Tag>
                            </div>

                            <div className={styles.screenshots}>
                                <div className={styles.screenshot}>
                                    <Image
                                        className={styles.screenshotImg}
                                        src={gameScreen1}
                                        alt={'Game screenshot 1'}
                                    />
                                </div>
                                <div className={styles.screenshot}>
                                    <Image
                                        className={styles.screenshotImg}
                                        src={gameScreen2}
                                        alt={'Game screenshot 2'}
                                    />
                                </div>
                            </div>

                            <div>
                                <Button
                                    className={styles.button}
                                    size="l"
                                    mode={'rock'}
                                    href={'https://game.kotlinlang.org/'}
                                >
                                    Play the Game
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div
                        ref={card3Ref}
                        className={cn(styles.card, styles.cardGradient)}
                        data-test="card-stack-card"
                        id={'yours-kotlin-effect'}
                    >
                        <div className={styles.cardInner}>
                            <div className={styles.cardContent}>
                                <h2 className={cn(textCn('rs-h1'), styles.cardTitle, styles.textInverted)}>
                                    Make the Kotlin Effect Yours
                                </h2>
                                <p className={cn(textCn('rs-subtitle-2'), styles.cardSubtitle, styles.textInverted)}>
                                    Move from fundamentals to real-world development – across mobile, backend, web, and
                                    desktop applications.
                                </p>
                            </div>

                            <div className={styles.tagsContainer}>
                                <div className={styles.multilineTag}>
                                    <p className={cn(darkLinkCn('rs-text-2'), styles.multilineTagText)}>
                                        <WinIcon className={styles.multilineTagIcon} />
                                        Exclusive anniversary offer: Get free access to select Kotlin courses on
                                        Hyperskill!
                                    </p>
                                </div>

                                <p className={cn(textCn('rs-text-2'), styles.tagLinksContainer)}>
                                    <a
                                        className={cn(darkLinkCn('rs-link', { mode: 'standalone' }), styles.darkLink)}
                                        href="https://hyperskill.org/categories/37"
                                    >
                                        Start Learning
                                    </a>
                                </p>
                            </div>

                            <div className={styles.linksGrid}>
                                <div className={styles.linksContainer}>
                                    <h3 className={cn(darkTextCn('rs-h3'), styles.linksSubtitle)}>Get started</h3>
                                    <ul className={cn(textCn('rs-ul'), styles.linksUl)}>
                                        <li className={styles.linksLi}>
                                            <a
                                                href="https://hyperskill.org/courses/69-introduction-to-kotlin"
                                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                            >
                                                Introduction to Kotlin
                                            </a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a
                                                href="https://academy.jetbrains.com/course/21067"
                                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                            >
                                                Kotlin Onboarding
                                            </a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a
                                                href="https://academy.jetbrains.com/course/17654"
                                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                            >
                                                Atomic Kotlin
                                            </a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a
                                                href="https://academy.jetbrains.com/course/16628"
                                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                            >
                                                Kotlin Koans
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={styles.linksContainer}>
                                    <h3 className={cn(darkTextCn('rs-h3'), styles.linksSubtitle)}>
                                        Build real projects
                                    </h3>
                                    <ul className={cn(textCn('rs-ul'), styles.linksUl)}>
                                        <li className={styles.linksLi}>
                                            <a
                                                href="https://hyperskill.org/courses/18-kotlin-core"
                                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                            >
                                                Kotlin Core
                                            </a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a
                                                href="https://hyperskill.org/courses/3-kotlin-developer"
                                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                            >
                                                Kotlin Developer
                                            </a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a
                                                href="https://developer.android.com/courses/jetpack-compose/course"
                                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                            >
                                                Jetpack Compose for Android Developers
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className={styles.linksContainer}>
                                    <h3 className={cn(darkTextCn('rs-h3'), styles.linksSubtitle)}>
                                        Explore professional tracks
                                    </h3>
                                    <ul className={cn(textCn('rs-ul'), styles.linksUl)}>
                                        <li className={styles.linksLi}>
                                            <a
                                                href="https://hyperskill.org/courses/45-introduction-to-ktor"
                                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                            >
                                                Introduction to Ktor
                                            </a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a
                                                href="https://academy.jetbrains.com/course/23312"
                                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                            >
                                                Kotlin Coroutines and Channels
                                            </a>
                                        </li>
                                        <li className={styles.linksLi}>
                                            <a
                                                href="https://hyperskill.org/courses/107"
                                                className={darkTextCn('rs-link', { mode: 'clear' })}
                                            >
                                                Advanced Kotlin Libraries and Techniques
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
