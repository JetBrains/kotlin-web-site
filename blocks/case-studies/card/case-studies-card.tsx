import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';
import { useTextStyles } from '@rescui/typography';
import React from 'react';
import cn from 'classnames';
import styles from './case-studies-card.module.css';
import { CaseItem } from '../case-studies';
import { PlatformIcon } from '../platform-icon/platform-icon';
import { mdToHtml } from '../../../utils/mdToHtml';
import { Theme, ThemeProvider, useThemeWithUndefined } from '@rescui/ui-contexts';

function reverse(theme: Theme): Theme {
    return theme === 'light' ? 'dark' : 'light';
}

export type CaseStudyCardProps = CaseItem & {
    className?: string;
    mode?: 'rock' | 'classic';
};

export const CaseStudyCard: React.FC<CaseStudyCardProps> = props => {
    const theme = useThemeWithUndefined();

    return <ThemeProvider theme={props.mode === 'rock' ? reverse(theme) : theme}>
        <CaseStudyCardText {...props} />
    </ThemeProvider>;
};

function getLogo(mode: CaseStudyCardProps['mode'], item: CaseItem) {

    return [
    ];
}

const CaseStudyCardText: React.FC<CaseStudyCardProps> = ({ className, mode, ...item }) => {
    const textCn = useTextStyles();

    const normalLogo = item.logo || [];
    const propertyName = mode === 'rock' ? 'alternateLogo' : 'logo';

    const logo = item[propertyName]?.[0] || normalLogo[0];
    const optionalSecondLogo = item[propertyName]?.[1] || normalLogo[1];

    const isYoutube = item.media?.type === 'youtube';
    const videoId = item.media?.type === 'youtube' ? item.media.videoId : undefined;
    const imageSrc = item.media?.type === 'image' ? item.media.path : undefined;

    return (
        <article
            className={cn(styles.card, className, styles[mode || 'classic'], textCn('rs-text-2', { hardness: 'hard' }))}
            data-testid="case-studies-card" id={item.id}>
            <div className={styles.content}>
                {logo &&
                    <div className={styles.logos}>
                        <img className={styles.logo} src={logo} alt={item.id} height={64} />
                        {optionalSecondLogo && (
                            <img className={styles.logo} src={optionalSecondLogo} alt="" height={64} />
                        )}
                    </div>
                }

                {item.description &&
                    <div
                        className={cn(styles.description)}
                        dangerouslySetInnerHTML={{ __html: mdToHtml(item.description) }}
                        data-testid="case-studies-card-description"
                    />}

                {item.signature &&
                    <div>
                        <strong className={styles.name}>{item.signature.name}</strong>
                        <div className={cn(styles.position, textCn('rs-text-2', {hardness: 'average'}))}>{item.signature.position}</div>
                    </div>
                }

                {item.link &&
                    <a
                        className={cn(styles.link, textCn('rs-link', {external: true}))}
                        href={item.link}
                    >
                        {item.linkText || 'Read the full story'}
                    </a>
                }

                {item.platforms && item.platforms.length > 0 &&
                    <div className={styles.platforms} aria-label="Platforms">
                        {item.platforms.map((platform) =>
                            <PlatformIcon key={platform} platform={platform} />
                        )}
                    </div>
                }
            </div>

            {item.media &&
                <div className={styles.media}>
                    {isYoutube ?
                        <YoutubePlayer
                            className={styles.youtubePlayer}
                            mode={0}
                            id={videoId}
                            previewImgSrc={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        />
                        :
                        <img className={styles.mediaImage} src={imageSrc} alt={`${item.id} case`} />
                    }
                </div>
            }
        </article>
    );
};
