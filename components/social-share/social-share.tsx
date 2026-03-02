import React, { FC, useState, useEffect } from 'react';
import cn from 'classnames';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@rescui/icons';
import { textCn } from '@rescui/typography';

import styles from './social-share.module.css';
import { truncateText } from '../../utils';

export type SocialShareTheme = 'light' | 'dark';
export type SocialShareSize = 's' | 'm' | 'l';
export type SocialNetwork = 'facebook' | 'twitter' | 'linkedin';

export interface SocialShareProps {
    url?: string;
    text?: string;
    via?: string;
    theme?: SocialShareTheme;
    size?: SocialShareSize;
    className?: string;
    networks?: SocialNetwork[];
    label?: string;
}

const DEFAULT_NETWORKS: SocialNetwork[] = ['facebook', 'twitter', 'linkedin'];
const SHARE_TEXT_LIMIT = 240;

export const SocialShare: FC<SocialShareProps> = (
    {
        url,
        text,
        via,
        theme = 'light',
        size = 'm',
        className,
        networks = DEFAULT_NETWORKS,
        label
    }
) => {
    const [shareUrl, setShareUrl] = useState(url || '');
    const [shareText, setShareText] = useState(text || '');

    useEffect(() => {
        if (!url) {
            setShareUrl(window.location.href);
        }
    }, [url]);

    useEffect(() => {
        if (!text) {
            setShareText(document.title);
        }
    }, [text]);

    const getShareLink = (network: SocialNetwork) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(truncateText(shareText, SHARE_TEXT_LIMIT));

        switch (network) {
            case 'facebook':
                return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            case 'twitter': {
                let twitterUrl = `https://x.com/intent/tweet?url=${encodedUrl}`;
                if (encodedText) {
                    twitterUrl += `&text=${encodedText}`;
                }
                if (via) {
                    twitterUrl += `&via=${encodeURIComponent(via)}`;
                }
                return twitterUrl;
            }
            case 'linkedin':
                return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            default:
                return '#';
        }
    };

    const renderIcon = (network: SocialNetwork) => {
        switch (network) {
            case 'facebook':
                return <FacebookIcon size={size} />;
            case 'twitter':
                return <TwitterIcon size={size} />;
            case 'linkedin':
                return <LinkedinIcon size={size} />;
        }
    };

    return (
        <div className={cn(styles.socialShare, styles[`theme_${theme}`], styles[`size_${size}`], className)}>
            {label && <span className={cn(styles.label, textCn('rs-text-2'))}>{label}</span>}
            <div className={styles.icons}>
                {networks.map((network) => (
                    <a
                        key={network}
                        href={getShareLink(network)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.iconLink}
                        title={`Share on ${network}`}
                        aria-label={`Share on ${network}`}
                    >
                        {renderIcon(network)}
                    </a>
                ))}
            </div>
        </div>
    );
};
