import React, { FC } from 'react';

import styles from './hero-video.module.css';
import kotlinEffectHeroMp4Video from './converted/kotlin-effect-hero.h264.mp4';
import kotlinEffectHeroWebmVideo from './converted/kotlin-effect-hero.vp9.webm';

const LOOP_START_SECONDS = 3.008;
const LOOP_END_OFFSET_SECONDS = 0.18;

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
        <video
            className={styles.video}
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            onTimeUpdate={loopBeforeEnd}
            onEnded={loopFromStartPoint}
        >
            <source src={kotlinEffectHeroWebmVideo} type='video/webm; codecs="vp9"' />
            <source src={kotlinEffectHeroMp4Video} type='video/mp4; codecs="avc1.4d401f"' />
        </video>
    );
};
