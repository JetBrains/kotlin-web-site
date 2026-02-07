import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@rescui/icons';
import { useTextStyles } from '@rescui/typography';

import styles from './social-share.module.css';

export type SocialShareTheme = 'light' | 'dark';
export type SocialShareSize = 's' | 'm' | 'l';
export type SocialNetwork = 'facebook' | 'twitter' | 'linkedin';

export interface SocialShareProps {
    url?: string;
    theme?: SocialShareTheme;
    size?: SocialShareSize;
    className?: string;
    networks?: SocialNetwork[];
    label?: string;
}

const DEFAULT_NETWORKS: SocialNetwork[] = ['facebook', 'twitter', 'linkedin'];

export const SocialShare: FC<SocialShareProps> = (
    {
        url,
        theme = 'light',
        size = 'm',
        className,
        networks = DEFAULT_NETWORKS,
        label
    }
) => {
    const textCn = useTextStyles();

    const shareUrl = useMemo(() => {
        if (url) {
            return url;
        }
        if (typeof window !== 'undefined') {
            return window.location.href;
        }
        return '';
    }, [url]);

    const getShareLink = (network: SocialNetwork) => {
        const encodedUrl = encodeURIComponent(shareUrl);

        switch (network) {
            case 'facebook':
                return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            case 'twitter':
                return `https://x.com/intent/tweet?url=${encodedUrl}`;
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
