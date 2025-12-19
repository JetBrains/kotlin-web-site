import React, { FC } from 'react';
import { useTextStyles } from '@rescui/typography';

import cn from 'classnames';
import styles from './video-block.module.css';
import { MiniVideoPlayer, MiniVideoPlayerProps, PlayButtonMode } from '@webteam/video-player';

type VideoBlockProps = {
    title: string;
    children?: React.ReactNode;
    iconPath: string;
    textWidthLimit?: string;
} & MiniVideoPlayerProps;

export const VideoBlock: FC<VideoBlockProps> = ({ className, title, children, iconPath, textWidthLimit, ...props }) => {
    const textCn = useTextStyles();

    return (
        <section className={cn(styles.videoBlock, 'ktl-layout', 'ktl-layout--center')}>
            <img src={iconPath} className={styles.icon} alt="" />
            <h2 className={cn(styles.title, textCn('rs-h1'))}>{title}</h2>
            <div className={cn(styles.subtitle, textCn('rs-subtitle-2', { hardness: 'average' }))}
                 style={textWidthLimit ? { 'maxWidth': textWidthLimit } : {}}>{children}</div>

            <MiniVideoPlayer
                {...props}
                className={cn(className, styles.videoPlayer)}
                autoplay={true}
                muted={true}
                playButtonMode={PlayButtonMode.Black}
            />
        </section>
    );
};