import React, { FC } from 'react';

import cn from 'classnames';

import styles from './performance.module.css';
import { useTextStyles } from '@rescui/typography';

import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';

import { Card } from '../card/card';


export const ServerSidePerformance: FC = ({}) => {

    const textCn = useTextStyles();

    return (
        <section className="ktl-layout ktl-layout--center">
            <div className="ktl-container section-offset">
                <h2 className={cn(textCn('rs-h1'))}>
                    Performance: optimized for high-load
                </h2>

                <h3 className={textCn('rs-subtitle-2')}>
                    From lightweight concurrency to efficient memory use, <br />
                    Kotlin and JVM combo brings serious advantage
                </h3>

                <div className={cn(styles.cards, 'ktl-offset-top-xl')}>
                    <Card
                        title={'Kotlin coroutines'}
                        description={'Run 10,000+ lightweight tasks on just a few threads.'}
                    />

                    <Card
                        title={'Inline functions'}
                        description={'Less overhead as the compiler copies function bodies at the call site.'}
                    />

                    <Card
                        title={'Inline classes'}
                        description={'Wrap primitives without extra allocations or garbage collector pressure'}
                    />

                    <Card
                        title={'The JVM'}
                        description={'Decades of fine-tuning for high throughput and low latency.'}
                    />
                </div>

                <div className={cn(styles.videos, 'ktl-offset-top-l')}>

                    <div className={styles.videoCard}>
                        <div className={styles.videoCardPlayer}>
                            <YoutubePlayer
                                mode={0}
                                id="hQrFfwT1IMo"
                                previewImgSrc="https://img.youtube.com/vi/hQrFfwT1IMo/maxresdefault.jpg"
                            />
                        </div>
                        <p className={cn(textCn('rs-text-2'), styles.videoCardDescription)}>
                            Watch the full story on Kotlin coroutines from their creator, Roman Elizarov.
                        </p>
                    </div>

                    <div className={styles.videoCard}>
                        <div className={styles.videoCardPlayer}>
                            <YoutubePlayer
                                mode={0}
                                id="TT62OL48Vl0"
                                previewImgSrc="https://img.youtube.com/vi/TT62OL48Vl0/maxresdefault.jpg"
                            />
                        </div>
                        <p className={cn(textCn('rs-text-2'), styles.videoCardDescription)}>
                            Watch the full story on Kotlin coroutines from their creator, Roman Elizarov.
                        </p>
                    </div>


                </div>

            </div>
        </section>
    );
};
