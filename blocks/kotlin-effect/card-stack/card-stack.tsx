import React, { FC, useCallback } from 'react';


import cn from 'classnames';

import Image from 'next/image';

import { useTextStyles } from '@rescui/typography';
import { Tag, presets as basePresets } from '@rescui/tag';
import { RocketIcon, PresentIcon, WinIcon } from '@rescui/icons';
import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';

import { useMM } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints';

import { trackEvent } from '@/utils/event-logger';

import styles from './card-stack.module.css';

import gameScreen1 from './screenshots/game-screenshot-1.webp';
import gameScreen2 from './screenshots/game-screenshot-2.webp';

import { Button } from '@rescui/button';

const VIDEO_ID = '4Qey8yExPNg';

export const CardStack: FC = () => {
    const textCn = useTextStyles();

    const tagPresets = {
        ...basePresets,
        light: { color: 'white', backgroundColor: '#19191C' }
    };

    const isMM = useMM();

     const trackVideoPlay = useCallback((videoId: string) => {
        trackEvent({
            eventAction: 'kt_kotlin_effect_video',
            eventLabel: videoId,
        });
    }, []);

    return (
        <section className={cn(styles.section)}>
            <div className="ktl-layout-v2 ktl-layout--center">

                <div
                    className={styles.card}
                    data-test="card-stack-card"
                    id={'kotlin-effect-in-real-life'}
                >

                    <div className={styles.cardContent}>
                        <h2 className={cn(textCn('rs-h1'), styles.cardTitle)}>
                            The Kotlin Effect in <span>Real Life</span>
                        </h2>
                        <p className={cn(textCn('rs-subtitle-2'), styles.cardSubtitle)}>
                            What happens when Kotlin’s logic goes beyond code? In this video, we bring the
                            Kotlin Effect into everyday life – making things more concise, efficient, and fun.
                        </p>
                    </div>

                    <div className={styles.videoPlaceholder} onClick={() => trackVideoPlay(VIDEO_ID)}>
                        <YoutubePlayer id={VIDEO_ID} />
                    </div>

                    <div className={styles.cardContent}>
                        <h2 className={cn(textCn('rs-h1'), styles.cardTitle)}>The Kotlin Effect in <span>Action</span>
                        </h2>
                        <p className={cn(textCn('rs-subtitle-2'), styles.cardSubtitle)}>
                            Step into a pixel-art world where Kodee battles bugs, breaks through boilerplate,
                            and rises from a gray legacy underworld to a vibrant Kotlin-powered future.
                        </p>
                    </div>

                    <div className={styles.tagsContainer}>
                        <Tag {...tagPresets.light} size={isMM ? 's' : 'm'} icon={<RocketIcon className={styles.icon} />}>
                            Survive the chaos
                        </Tag>
                        <Tag {...tagPresets.light} size={isMM ? 's' : 'm'} icon={<PresentIcon className={styles.icon} />}>
                            Unlock Kotlin-inspired power-ups
                        </Tag>
                        <Tag {...tagPresets.light} size={isMM ? 's' : 'm'} icon={<WinIcon className={styles.icon} />}>
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
                            href={'https://game.kotlinlang.org/'}
                            mode={'rock'}
                            size={'l'}
                            className={styles.button}
                            target="_blank" rel="noopener noreferrer"
                        >
                            Play the Game
                        </Button>
                    </div>

                </div>


            </div>
        </section>
    );
};
