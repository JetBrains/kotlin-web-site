import React, { FC } from 'react';

import cn from 'classnames';

import styles from './additional-materials.module.css';
import { useTextStyles } from '@rescui/typography';

import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';

export const AdditionalMaterials: FC = ({}) => {

    const textCn = useTextStyles();

    return (
        <section className="ktl-layout ktl-layout--center">
            <div className="ktl-container section-offset">

                <h2 className={cn(textCn('rs-h1'))}>
                    Additional materials
                </h2>

                <h3 className={textCn('rs-subtitle-2')}>
                    Build better backends with Kotlin. Check out the Kotlin for Backend playlist for real-world use
                    cases, expert insights, and performance tips.
                </h3>

                <div className="ktl-row">
                    <div className="ktl-col-12 ktl-col-md-8">
                        <YoutubePlayer
                            mode={0}
                            id="hQrFfwT1IMo"
                            previewImgSrc="https://img.youtube.com/vi/hQrFfwT1IMo/maxresdefault.jpg"
                        />
                    </div>
                </div>


            </div>
        </section>
    );
};
