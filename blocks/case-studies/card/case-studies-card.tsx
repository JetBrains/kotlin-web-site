import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';
import { useTextStyles } from '@rescui/typography';
import React from 'react';
import cn from 'classnames';
import styles from './case-studies-card.module.css';
import { CaseItem } from '../case-studies';
import { PlatformIcon } from '../platform-icon/platform-icon';
import { mdToHtml } from '../../../utils/mdToHtml';

type CaseStudyCardProps = CaseItem & {
    className?: string;
};

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ className, ...item }) => {
    const textCn = useTextStyles();
    const logos = item.logo ?? [];
    const logo = logos[0];
    const optionalSecondLogo = logos[1];

    const isYoutube = item.media?.type === 'youtube';
    const videoId = item.media?.type === 'youtube' ? item.media.videoId : undefined;
    const imageSrc = item.media?.type === 'image' ? item.media.path : undefined;

    return (
        <article className={cn(styles.card, className)} data-testid="case-studies-card" id={item.id}>
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
                        className={cn(styles.description, textCn('rs-text-2'))}
                        dangerouslySetInnerHTML={{ __html: mdToHtml(item.description) }}
                        data-testid="case-studies-card-description"
                    />}

                {item.signature &&
                    <div className={textCn('rs-text-2')}>
                        <strong className={styles.name}>{item.signature.name}</strong>
                        <div className={styles.position}>{item.signature.position}</div>
                    </div>
                }

                {item.link &&
                    <a
                        className={cn(styles.link, `ktl-text-1 rs-link ${item.isExternal ? 'rs-link_external' : ''}`)}
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
