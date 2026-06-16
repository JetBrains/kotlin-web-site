import React, { FC } from 'react';

import cn from 'classnames';

import styles from './hero-video.module.css';
import kotlinEffectHeroWebmVideo from './converted/kotlin-effect-hero.vp9.webm';
import kotlinEffectHeroMobileWebmVideo from './converted/kotlin-effect-hero-mobile.vp9.webm';

const LOOP_START_SECONDS = 3;

export const HeroVideo: FC = () => {
    const loopFromStartPoint = (event: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = event.currentTarget;

        video.currentTime = LOOP_START_SECONDS;
        void video.play();
    };

    return (
        <>
            <video
                className={cn(styles.video, styles.videoDesktop)}
                autoPlay
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
                onEnded={loopFromStartPoint}
            >
                <source src={kotlinEffectHeroWebmVideo} type='video/webm; codecs="vp9"' />
            </video>
            <video
                className={cn(styles.video, styles.videoMobile)}
                autoPlay
                muted
                playsInline
                loop
                preload="auto"
                aria-hidden="true"
            >
                <source src={kotlinEffectHeroMobileWebmVideo} type='video/webm; codecs="vp9"' />
            </video>
        </>
    );
};
