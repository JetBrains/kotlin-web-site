import React, { FC, useState, useEffect } from 'react';
import cn from 'classnames';
import { FacebookIcon, TwitterIcon, LinkedinIcon, RedditIcon, EmailOutlineIcon } from '@rescui/icons';
import { textCn } from '@rescui/typography';

import styles from './social-share.module.css';
import { truncateText } from '@/utils';

export type SocialShareTheme = 'light' | 'dark';
export type SocialShareSize = 's' | 'm' | 'l';
export type SocialNetwork = 'facebook' | 'twitter' | 'linkedin' | 'reddit' | 'email';

export interface SocialShareProps {
    url?: string;
    text?: string;
    via?: string;
    theme?: SocialShareTheme;
    size?: SocialShareSize;
    className?: string;
    networks?: SocialNetwork[];
    label?: string;
    /** Called with the clicked network, e.g. to report the share to analytics. */
    onShareClick?: (network: SocialNetwork) => void;
}

const DEFAULT_NETWORKS: SocialNetwork[] = ['twitter', 'facebook', 'linkedin'];
const SHARE_TEXT_LIMIT = 240;

const NETWORK_TITLES: Record<SocialNetwork, string> = {
    twitter: 'Share on X',
    facebook: 'Share on Facebook',
    linkedin: 'Share on LinkedIn',
    reddit: 'Share on Reddit',
    email: 'Share by email',
};

export const SocialShare: FC<SocialShareProps> = (
    {
        url,
        text,
        via,
        theme = 'light',
        size = 'm',
        className,
        networks = DEFAULT_NETWORKS,
        label,
        onShareClick
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
            case 'reddit': {
                let redditUrl = `https://www.reddit.com/submit?url=${encodedUrl}`;
                if (encodedText) {
                    redditUrl += `&title=${encodedText}`;
                }
                return redditUrl;
            }
            case 'email': {
                const subject = encodedText ? `subject=${encodedText}&` : '';
                return `mailto:?${subject}body=${encodedUrl}`;
            }
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
            case 'reddit':
                return <RedditIcon size={size} />;
            case 'email':
                return <EmailOutlineIcon size={size} />;
        }
    };

    return (
        <div className={cn(styles.socialShare, styles[`theme_${theme}`], styles[`size_${size}`], className)}>
            {label && (
                <span className={cn(styles.label, textCn((size === 'l' ? 'rs-text-1' : 'rs-text-2'), {hardness: 'hard'}))}>{label}</span>
            )}
            <div className={styles.icons}>
                {networks.map((network) => (
                    <a
                        key={network}
                        href={getShareLink(network)}
                        // a mailto: link must stay in the current tab, otherwise it leaves a blank one behind
                        target={network === 'email' ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className={styles.iconLink}
                        title={NETWORK_TITLES[network]}
                        aria-label={NETWORK_TITLES[network]}
                        onClick={() => onShareClick?.(network)}
                    >
                        {renderIcon(network)}
                    </a>
                ))}
            </div>
        </div>
    );
};
