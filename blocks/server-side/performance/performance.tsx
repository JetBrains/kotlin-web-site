import React, { FC, useCallback } from 'react';

import cn from 'classnames';

import styles from './performance.module.css';
import { useTextStyles } from '@rescui/typography';

import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';

import { Card } from '../card/card';
import { trackEvent } from '../../../utils/event-logger';
import { useIntersectionTracking } from '../../../utils/use-untersection-tracking';


const romanVideoId = 'hQrFfwT1IMo';
const adobeVideoId = 'TT62OL48Vl0';

export const ServerSidePerformance: FC = ({}) => {
    const textCn = useTextStyles();

    const trackVideoPlay = useCallback((videoId: string) => {
        trackEvent({
            eventAction: 'kt_server_side_performance_video',
            eventLabel: videoId,
        });
    }, []);

    const handleIntersection = useCallback(() => {
        trackEvent({
            eventAction: 'kt_server_side_performance_read'
        });
    }, []);

    const sectionRef = useIntersectionTracking(handleIntersection);

    return (
        <section ref={sectionRef} className="ktl-layout ktl-layout--center">
            <div className="ktl-container section-offset" id={'performance'}>
                <h2 className={cn(textCn('rs-h1'))}>
                    Performance: optimized for high-load
                </h2>

                <div className={cn(styles.cards)}>
                    <Card
                        title={'Kotlin coroutines'}
                        description={'Run 10,000+ lightweight tasks on just a few threads'}
                    />

                    <Card
                        title={'Inline functions'}
                        description={'Less overhead as the compiler copies function bodies at the call site'}
                    />

                    <Card
                        title={'Inline classes'}
                        description={'Wrap primitives without extra allocations or garbage collector pressure'}
                    />

                    <Card
                        title={'The JVM'}
                        description={'Decades of fine-tuning for high throughput and low latency'}
                    />
                </div>

                <div className={cn(styles.videos, 'ktl-offset-top-l')}>

                    <div className={styles.videoCard}>
                        <div className={styles.videoCardPlayer} onClick={() => trackVideoPlay(romanVideoId)}>
                            <YoutubePlayer
                                mode={0}
                                id={romanVideoId}
                                previewImgSrc={`https://img.youtube.com/vi/${romanVideoId}/maxresdefault.jpg`}
                            />
                        </div>
                        <p className={cn(textCn('rs-text-2'), styles.videoCardDescription)}>
                            Watch the full story on Kotlin coroutines from their creator, Roman Elizarov.
                        </p>
                    </div>

                    <div className={styles.videoCard}>
                        <div className={styles.videoCardPlayer} onClick={() => trackVideoPlay(adobeVideoId)}>
                            <YoutubePlayer
                                mode={0}
                                id={adobeVideoId}
                                previewImgSrc={`https://img.youtube.com/vi/${adobeVideoId}/maxresdefault.jpg`}
                            />
                        </div>
                        <p className={cn(textCn('rs-text-2'), styles.videoCardDescription)}>
                           Watch Adobe’s talk on using coroutines to scale under massive load.
                        </p>
                    </div>


                </div>

            </div>
        </section>
    );
};
