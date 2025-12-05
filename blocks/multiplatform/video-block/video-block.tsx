import React, {FC} from 'react';
import { useTextStyles } from '@rescui/typography';
import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';
import cn from 'classnames';
import styles from './video-block.module.css';

interface VideoBlockProps {
    videoId: string;
    title: string;
    children?: React.ReactNode;
    iconPath: string;
    textWidthLimit?: string;
}

export const VideoBlock: FC<VideoBlockProps> = ({videoId, title, children, iconPath, textWidthLimit}) => {
    const textCn = useTextStyles();

    return (
        <div className={cn(styles.videoBlock, 'ktl-layout', 'ktl-layout--center')}>
            <img src={iconPath} className={styles.icon} alt="" />
            <h2 className={cn(styles.title, textCn('rs-h1'))}>{title}</h2>
            <div className={cn(styles.subtitle, textCn("rs-subtitle-2", {hardness: "average"}))} style={textWidthLimit ? {'maxWidth': textWidthLimit} : {}}>{children}</div>
            <YoutubePlayer id={videoId} className={styles.videoPlayer} />
        </div>
    );
}