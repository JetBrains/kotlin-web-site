import { FC, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import Img from 'next/image';
import { useInView } from 'react-intersection-observer';
import { Button } from '@rescui/button';
import { PauseIcon, PlayIcon } from '@rescui/icons';
import styles from './platform-benefits-block.module.css';

import phoneFrame from './images/phone-frame.svg';
import appVideo from './video/compose-multiplatform-app.mp4';

// Safari paints nothing for a paused video with preload="metadata" and no poster;
// a non-zero start time forces it to decode and show the first frame
// (zero doesn't trigger the seek)
const VIDEO_SRC = `${appVideo}#t=0.001`;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const PhoneVideo: FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    // Once the user pauses the video, scrolling it back into view must not restart it
    const [isPausedByUser, setIsPausedByUser] = useState(false);
    const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (!inView) video.pause();
        else if (!isPausedByUser && !prefersReducedMotion()) void video.play().catch(() => {});
    }, [inView, isPausedByUser]);

    const togglePlayback = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            setIsPausedByUser(false);
            void video.play();
        } else {
            setIsPausedByUser(true);
            video.pause();
        }
    };

    return (
        <div ref={inViewRef} className={styles.phone} data-testid="platform-benefits-phone">
            <div className={styles.screen}>
                <video
                    ref={videoRef}
                    className={styles.video}
                    src={VIDEO_SRC}
                    preload="metadata"
                    muted
                    loop
                    playsInline
                    onClick={togglePlayback}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    aria-label="Respawn app built with Compose Multiplatform running on iOS"
                    data-testid="platform-benefits-video"
                />
            </div>
            <Img src={phoneFrame} alt="" className={styles.phoneFrame} />
            <Button
                className={cn(styles.playButton, { [styles.playButtonHidden]: isPlaying })}
                mode="rock"
                theme="light"
                size="l"
                icon={isPlaying ? <PauseIcon /> : <PlayIcon />}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                onClick={togglePlayback}
                data-testid="platform-benefits-play-button"
            />
        </div>
    );
};
