import React, { FC, useRef, useState } from 'react';
import cn from 'classnames';

import styles from './hero-video.module.css';
import kodeeAppearSafariVideo from '../converted/KotlinEffect_Website_Kodee_Appear_safari.mov';
import kodeeAppearVideo from '../converted/KotlinEffect_Website_Kodee_Appear.webm';
import kodeeLoopSafariVideo from '../converted/KotlinEffect_Website_Kodee_Loop_safari.mov';
import kodeeLoopVideo from '../converted/KotlinEffect_Website_Kodee_Loop.webm';
import shapesAppearSafariVideo from '../converted/KotlinEffect_Website_Shapes_Appear_safari.mov';
import shapesAppearVideo from '../converted/KotlinEffect_Website_Shapes_Appear.webm';
import shapesLoopSafariVideo from '../converted/KotlinEffect_Website_Shapes_Loop_safari.mov';
import shapesLoopVideo from '../converted/KotlinEffect_Website_Shapes_Loop.webm';

type VideoSourcesProps = {
    safariSrc: string;
    webmSrc: string;
};

const VIDEO_FPS = 30;
const HANDOFF_FRAMES = 1;
const HANDOFF_OFFSET = HANDOFF_FRAMES / VIDEO_FPS;
const APPEAR_HIDE_DELAY = 30;

const VideoSources: FC<VideoSourcesProps> = ({ safariSrc, webmSrc }) => (
    <>
        <source src={safariSrc} type='video/mp4; codecs="hvc1"' />
        <source src={webmSrc} type='video/webm; codecs="vp9"' />
    </>
);

export const HeroVideo: FC = () => {
    const shapesLoopVideoRef = useRef<HTMLVideoElement>(null);
    const kodeeLoopVideoRef = useRef<HTMLVideoElement>(null);
    const isShapesLoopStartedRef = useRef(false);
    const isKodeeLoopStartedRef = useRef(false);
    const [isShapesAppearHidden, setIsShapesAppearHidden] = useState(false);
    const [isShapesLoopVisible, setIsShapesLoopVisible] = useState(false);
    const [isKodeeAppearHidden, setIsKodeeAppearHidden] = useState(false);
    const [isKodeeLoopVisible, setIsKodeeLoopVisible] = useState(false);

    const showLoopVideo = (
        appearVideo: HTMLVideoElement,
        video: HTMLVideoElement | null,
        setIsLoopVisible: (isVisible: boolean) => void,
        setIsAppearHidden: (isHidden: boolean) => void,
        isLoopStartedRef: React.MutableRefObject<boolean>
    ) => {
        if (isLoopStartedRef.current) {
            return;
        }

        isLoopStartedRef.current = true;

        if (!video) {
            setIsLoopVisible(true);
            setIsAppearHidden(true);
            return;
        }

        appearVideo.pause();
        video.currentTime = 0;
        void video.play();
        setIsLoopVisible(true);
        window.setTimeout(() => setIsAppearHidden(true), APPEAR_HIDE_DELAY);
    };

    const showLoopVideoBeforeEnd = (
        event: React.SyntheticEvent<HTMLVideoElement>,
        video: HTMLVideoElement | null,
        setIsLoopVisible: (isVisible: boolean) => void,
        setIsAppearHidden: (isHidden: boolean) => void,
        isLoopStartedRef: React.MutableRefObject<boolean>
    ) => {
        const appearVideo = event.currentTarget;

        if (appearVideo.duration && appearVideo.currentTime >= appearVideo.duration - HANDOFF_OFFSET) {
            showLoopVideo(appearVideo, video, setIsLoopVisible, setIsAppearHidden, isLoopStartedRef);
        }
    };

    return (
        <div className={styles.videoContainer}>
            <div className={cn(styles.animationLayer, styles.shapesLayer)}>
                <video
                    className={cn(styles.video, styles.appearVideo, {
                        [styles.hiddenVideo]: isShapesAppearHidden
                    })}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    onTimeUpdate={(event) =>
                        showLoopVideoBeforeEnd(
                            event,
                            shapesLoopVideoRef.current,
                            setIsShapesLoopVisible,
                            setIsShapesAppearHidden,
                            isShapesLoopStartedRef
                        )
                    }
                    onEnded={(event) =>
                        showLoopVideo(
                            event.currentTarget,
                            shapesLoopVideoRef.current,
                            setIsShapesLoopVisible,
                            setIsShapesAppearHidden,
                            isShapesLoopStartedRef
                        )
                    }
                >
                    <VideoSources safariSrc={shapesAppearSafariVideo} webmSrc={shapesAppearVideo} />
                </video>
                <video
                    ref={shapesLoopVideoRef}
                    className={cn(styles.video, styles.loopVideo, {
                        [styles.visibleVideo]: isShapesLoopVisible
                    })}
                    loop
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                >
                    <VideoSources safariSrc={shapesLoopSafariVideo} webmSrc={shapesLoopVideo} />
                </video>
            </div>

            <div className={cn(styles.animationLayer, styles.kodeeLayer)}>
                <video
                    className={cn(styles.video, styles.appearVideo, {
                        [styles.hiddenVideo]: isKodeeAppearHidden
                    })}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    onTimeUpdate={(event) =>
                        showLoopVideoBeforeEnd(
                            event,
                            kodeeLoopVideoRef.current,
                            setIsKodeeLoopVisible,
                            setIsKodeeAppearHidden,
                            isKodeeLoopStartedRef
                        )
                    }
                    onEnded={(event) =>
                        showLoopVideo(
                            event.currentTarget,
                            kodeeLoopVideoRef.current,
                            setIsKodeeLoopVisible,
                            setIsKodeeAppearHidden,
                            isKodeeLoopStartedRef
                        )
                    }
                >
                    <VideoSources safariSrc={kodeeAppearSafariVideo} webmSrc={kodeeAppearVideo} />
                </video>
                <video
                    ref={kodeeLoopVideoRef}
                    className={cn(styles.video, styles.loopVideo, {
                        [styles.visibleVideo]: isKodeeLoopVisible
                    })}
                    loop
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                >
                    <VideoSources safariSrc={kodeeLoopSafariVideo} webmSrc={kodeeLoopVideo} />
                </video>
            </div>
        </div>
    );
};
