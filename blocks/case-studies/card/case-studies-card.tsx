import React from 'react';
import cn from 'classnames';
import styles from './case-studies-card.module.css';
import { AndroidIcon, AppleIcon, ServerIcon, ComputerIcon, GlobusIcon } from '@rescui/icons';
import { CaseItem, CaseType, isExternalCase, CasePlatform } from '../case-studies';

/**
 * Resolve asset path from YAML:
 * - http/https or path starting with "/" => return as is
 * - otherwise => treat as a filename under /images/case-studies/
 */
const resolveAssetPath = (v?: string) => {
    if (!v) return '';
    return `/images/case-studies/${v}`;
};

/**
 * Very small markdown -> HTML for bold (**text**) and links [text](url).
 * Safe subset suitable for our content. Extend if needed.
 */
const mdToHtml = (md: string) => {
    // escape basic HTML first
    const esc = md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // bold: **text**
    const withBold = esc.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // links: [text](url)
    const withLinks = withBold.replace(
        /\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    return withLinks;
};

const badgeText: Record<CaseType, string> = {
    'multiplatform': 'Kotlin Multiplatform',
    'server-side': 'Server-side'
};

const badgeClass: Record<CaseType, string> = {
    'multiplatform': 'badgeMultiplatform',
    'server-side': 'badgeServerSide'
};

// Platform icon path builder. If you keep icons in (for example) /images/platforms/*.svg,
// they’ll be resolved automatically by key. If an icon is missing, we still render the label.
const getPlatformIcon = (p: CasePlatform) => {
    switch (p) {
        case 'android':
            return <AndroidIcon />;
        case 'ios':
            return <AppleIcon />;
        case 'desktop':
            return <ComputerIcon />;
        case 'frontend':
            return <GlobusIcon />;
        case 'backend':
            return <ServerIcon />;
        case 'compose-multiplatform':
            return <img className={styles.platformIcon} src={'/images/platforms/compose-multiplatform.svg'}
                        alt="Compose Multiplatform icon"
                        onError={(e) => hideBrokenIcon(e.currentTarget)} />;
        default:
            return null;
    }
};

type Props = CaseItem &{
    className?: string;
};

export const CaseStudyCard: React.FC<Props> = ({ className, ...item }) => {
    const logos = item.logo ?? [];
    const logoSrc1 = resolveAssetPath(logos[0]);
    const logoSrc2 = resolveAssetPath(logos[1]);

    const hasMedia = Boolean(item.media);
    const isYoutube = item.media?.type === 'youtube';
    const mediaUrl = item.media?.type === 'youtube' ? item.media.url : undefined;
    const mediaImgSrc = item.media?.type === 'image' ? resolveAssetPath(item.media.path) : undefined;

    return (
        <article className={cn(styles.card, className)}>
            {/* Header: type badge and logos (0–2) */}
            <header className={styles.header}>
        <span className={cn(styles.badge, styles[badgeClass[item.type]])}>
          {badgeText[item.type]}
        </span>

                {(logoSrc1 || logoSrc2) && (
                    <div className={cn(styles.logos, { [styles.logosDouble]: Boolean(logoSrc1 && logoSrc2) })}>
                        {logoSrc1 && (
                            <img className={styles.logo} src={logoSrc1} alt="Logo" />
                        )}
                        {logoSrc2 && (
                            <img className={cn(styles.logo, styles.logoSecond)} src={logoSrc2} alt="Second logo" />
                        )}
                    </div>
                )}
            </header>

            {/* Media (optional): YouTube or Image */}
            {hasMedia && (
                <div className={styles.media}>
                    {isYoutube && mediaUrl && (
                        <div className={styles.mediaVideo}>
                            <iframe
                                className={styles.iframe}
                                src={toYoutubeEmbedUrl(mediaUrl)}
                                title="Case study video"
                                frameBorder={0}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    )}
                    {!isYoutube && mediaImgSrc && (
                        <img className={styles.mediaImage} src={mediaImgSrc} alt="Case media" />
                    )}
                </div>
            )}

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: mdToHtml(item.description) }}
            />

            {item.signature && (
                <div className={styles.signature}>
                    <div
                        className={styles.signatureLine1}
                        dangerouslySetInnerHTML={{ __html: mdToHtml(item.signature.line1) }}
                    />
                    <div className={styles.signatureLine2}>{item.signature.line2}</div>
                </div>
            )}

            {/* Platforms (optional) */}
            {item.platforms && item.platforms.length > 0 && (
                <div className={styles.platforms} aria-label="Platforms">
                    {item.platforms.map((p) => {
                        const iconSrc = getPlatformIcon(p);
                        // We render icon + label; if icon path 404s, the label remains visible
                        return (
                            <span key={p} className={styles.platform}>
                                <>
                {getPlatformIcon(p)}
                                    </>
                <span className={styles.platformLabel}>{humanizePlatform(p)}</span>
              </span>
                        );
                    })}
                </div>
            )}
            {(isExternalCase(item)) ? (
                <div className={styles.actions}>
                    {item.externalLink && (
                        <a
                            className={styles.button}
                            href={item.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {item.externalLinkText || 'Read the full story'}
                        </a>
                    )}
                </div>
            ) : null}
        </article>
    );
};

/**
 * Convert various YouTube URL shapes to embed URL.
 * Supports:
 * - https://youtu.be/ID
 * - https://www.youtube.com/watch?v=ID
 * - https://www.youtube.com/live/ID
 * Falls back to input URL if not recognized.
 */
function toYoutubeEmbedUrl(url: string): string {
    try {
        const u = new URL(url);
        // youtu.be/VIDEO
        if (u.hostname.includes('youtu.be')) {
            const id = u.pathname.replace('/', '');
            return `https://www.youtube.com/embed/${id}`;
        }
        // youtube.com/watch?v=VIDEO
        if (u.searchParams.has('v')) {
            return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
        }
        // youtube.com/live/VIDEO
        if (u.pathname.startsWith('/live/')) {
            const id = u.pathname.replace('/live/', '').split('/')[0];
            return `https://www.youtube.com/embed/${id}`;
        }
        return url;
    } catch {
        return url;
    }
}

/**
 * If a platform icon is missing (404), hide the broken <img> and keep the label visible.
 */
function hideBrokenIcon(img: HTMLImageElement) {
    img.style.display = 'none';
}

/**
 * Humanize platform name for label.
 */
function humanizePlatform(p: CasePlatform): string {
    switch (p) {
        case 'compose-multiplatform':
            return 'Compose Multiplatform';
        case 'ios':
            return 'iOS';
        default:
            // 'android' | 'desktop'
            return capitalize(p);
    }
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}