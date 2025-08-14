import React, { FC } from 'react';

import cn from 'classnames';

import styles from './additional-materials.module.css';
import { useTextStyles } from '@rescui/typography';

// @ts-ignore
import YoutubePlaylist from '@webteam/youtube-playlist/lib';

export const AdditionalMaterials: FC = ({}) => {

    const textCn = useTextStyles();

    return (
        <section className="ktl-layout ktl-layout--center">
            <div className="ktl-container section-offset">

                <h2 className={cn(textCn('rs-h1'))}>
                    Additional materials
                </h2>

                <h3 className={cn(textCn('rs-subtitle-2'), styles.subtitle)}>
                    Build better backends with Kotlin. Check out the Kotlin for Backend playlist for real-world use
                    cases, expert insights, and performance tips.
                </h3>

                <div className="ktl-row">
                    <div className="ktl-col-12">
                        <YoutubePlaylist
                            playlistId="PLlFc5cFwUnmx-dpq9nkdaVJX0GnrM1Mp1"
                            playlistTitle="Server-Side Development with Kotlin"
                        />
                    </div>
                </div>


            </div>
        </section>
    );
};
