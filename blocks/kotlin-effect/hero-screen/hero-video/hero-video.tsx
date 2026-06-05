import React, { FC } from 'react';

import cn from 'classnames';

import styles from './hero-video.module.css';
import kotlinEffectHeroMp4Video from './converted/kotlin-effect-hero.h264.mp4';
import kotlinEffectHeroMobileMp4Video from './converted/kotlin-effect-hero-mobile.h264.mp4';
import kotlinEffectHeroMobileWebmVideo from './converted/kotlin-effect-hero-mobile.vp9.webm';

const LOOP_START_SECONDS = 3;
const LOOP_END_OFFSET_SECONDS = 0;

export const HeroVideo: FC = () => {
    const loopFromStartPoint = (event: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = event.currentTarget;

        if (video.duration <= LOOP_START_SECONDS) {
            return;
        }

        video.currentTime = LOOP_START_SECONDS;
        void video.play();
    };

    const loopBeforeEnd = (event: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = event.currentTarget;

        if (video.duration && video.currentTime >= video.duration - LOOP_END_OFFSET_SECONDS) {
            loopFromStartPoint(event);
        }
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
                onTimeUpdate={loopBeforeEnd}
                onEnded={loopFromStartPoint}
            >
                <source src={kotlinEffectHeroMp4Video} type='video/mp4; codecs="avc1.4d401f"' />
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
                <source src={kotlinEffectHeroMobileMp4Video} type='video/mp4; codecs="avc1.4d401f"' />
            </video>
        </>
    );
};
