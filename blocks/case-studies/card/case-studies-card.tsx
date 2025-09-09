// TypeScript React
import React from 'react';
import classNames from 'classnames';

type Platform =
    | 'android'
    | 'ios'
    | 'desktop'
    | 'frontend'
    | 'backend'
    | 'compose-multi-platform';

type CaseType = 'multiplatform' | 'server-side';

type Media =
    | { type: 'youtube'; url: string }
    | { type: 'image'; path: string };

interface Signature {
    // markdown allowed (e.g., **Name Surname**, Role)
    line1: string;
    // plain text
    line2: string;
}

export interface CaseCardItem {
    logos?: [string] | [string, string]; // 0–2 logos, local paths or filenames
    description: string;                 // markdown-enabled text
    signature?: Signature;
    readMoreUrl?: string;                // "Read the full story →"
    exploreUrl?: string;                 // "Explore the stories"
    caseType: CaseType;
    platforms?: Platform[];              // platform icons row
    media?: Media;                       // youtube or local image
}

/**
 * Resolve asset path from YAML:
 * - http/https or path starting with "/" => return as is
 * - otherwise => treat as a filename under /images/case-studies/
 */
const resolveAssetPath = (v?: string) => {
    if (!v) return '';
    const lower = v.toLowerCase();
    if (lower.startsWith('http://') || lower.startsWith('https://') || v.startsWith('/')) return v;
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
    'server-side': 'Server-side',
};

const badgeClass: Record<CaseType, string> = {
    'multiplatform': 'badgeMultiplatform',
    'server-side': 'badgeServerSide',
};

// Platform icon path builder. If you keep icons in (for example) /images/platforms/*.svg,
// they’ll be resolved automatically by key. If an icon is missing, we still render the label.
const platformIconPath = (p: Platform) => `/images/platforms/${p}.svg`;

type Props = {
    item: CaseCardItem;
    className?: string;
};

export const CaseStudyCard: React.FC<Props> = ({ item, className }) => {
    const logos = item.logos ?? [];
    const logoSrc1 = resolveAssetPath(logos[0]);
    const logoSrc2 = resolveAssetPath(logos[1]);

    const hasMedia = Boolean(item.media);
    const isYoutube = item.media?.type === 'youtube';
    const mediaUrl = item.media?.type === 'youtube' ? item.media.url : undefined;
    const mediaImgSrc = item.media?.type === 'image' ? resolveAssetPath(item.media.path) : undefined;

    return (
        <article className={classNames('cs-card', className)}>
            {/* Header: type badge and logos (0–2) */}
            <header className="cs-card__header">
        <span className={classNames('cs-card__badge', badgeClass[item.caseType])}>
          {badgeText[item.caseType]}
        </span>

                {(logoSrc1 || logoSrc2) && (
                    <div className={classNames('cs-card__logos', { 'cs-card__logos--double': Boolean(logoSrc1 && logoSrc2) })}>
                        {logoSrc1 && (
                            <img className="cs-card__logo" src={logoSrc1} alt="Logo" />
                        )}
                        {logoSrc2 && (
                            <img className="cs-card__logo cs-card__logo--second" src={logoSrc2} alt="Second logo" />
                        )}
                    </div>
                )}
            </header>

            {/* Media (optional): YouTube or Image */}
            {hasMedia && (
                <div className="cs-card__media">
                    {isYoutube && mediaUrl && (
                        <div className="cs-card__media-video">
                            <iframe
                                className="cs-card__iframe"
                                src={toYoutubeEmbedUrl(mediaUrl)}
                                title="Case study video"
                                frameBorder={0}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    )}
                    {!isYoutube && mediaImgSrc && (
                        <img className="cs-card__media-image" src={mediaImgSrc} alt="Case media" />
                    )}
                </div>
            )}

            {/* Description (markdown) */}
            <div
                className="cs-card__description"
                dangerouslySetInnerHTML={{ __html: mdToHtml(item.description) }}
            />

            {/* Signature (optional) */}
            {item.signature && (
                <div className="cs-card__signature">
                    <div
                        className="cs-card__signature-line1"
                        dangerouslySetInnerHTML={{ __html: mdToHtml(item.signature.line1) }}
                    />
                    <div className="cs-card__signature-line2">{item.signature.line2}</div>
                </div>
            )}

            {/* Platforms (optional) */}
            {item.platforms && item.platforms.length > 0 && (
                <div className="cs-card__platforms" aria-label="Platforms">
                    {item.platforms.map((p) => {
                        const iconSrc = platformIconPath(p);
                        // We render icon + label; if icon path 404s, the label remains visible
                        return (
                            <span key={p} className="cs-card__platform">
                <img className="cs-card__platform-icon" src={iconSrc} alt={`${p} icon`} onError={(e) => hideBrokenIcon(e.currentTarget)} />
                <span className="cs-card__platform-label">{humanizePlatform(p)}</span>
              </span>
                        );
                    })}
                </div>
            )}

            {/* Actions */}
            {(item.readMoreUrl || item.exploreUrl) && (
                <div className="cs-card__actions">
                    {item.readMoreUrl && (
                        <a
                            className="cs-card__link"
                            href={item.readMoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Read the full story →
                        </a>
                    )}
                    {item.exploreUrl && (
                        <a
                            className="cs-card__button"
                            href={item.exploreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Explore the stories
                        </a>
                    )}
                </div>
            )}

            <style jsx>{`
        .cs-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .cs-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .cs-card__badge {
          font-size: 12px;
          font-weight: 600;
          padding: 6px 10px;
          border-radius: 999px;
          line-height: 1;
          white-space: nowrap;
        }
        .badgeMultiplatform {
          background: #eef7ff;
          color: #1565c0;
          border: 1px solid rgba(21,101,192,0.15);
        }
        .badgeServerSide {
          background: #eef9f2;
          color: #1b5e20;
          border: 1px solid rgba(27,94,32,0.15);
        }
        .cs-card__logos {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cs-card__logo {
          height: 28px;
          width: auto;
          object-fit: contain;
          max-width: 140px;
          opacity: 0.95;
        }
        .cs-card__logo--second {
          border-left: 1px solid rgba(0,0,0,0.06);
          padding-left: 10px;
        }

        .cs-card__media {
          border-radius: 10px;
          overflow: hidden;
          background: #f6f7f9;
        }
        .cs-card__media-video {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
        }
        .cs-card__iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .cs-card__media-image {
          width: 100%;
          height: auto;
          display: block;
        }

        .cs-card__description {
          color: #1f2328;
          font-size: 16px;
          line-height: 1.6;
        }
        .cs-card__description :global(a) {
          color: #0b65c2;
          text-decoration: underline;
        }
        .cs-card__description :global(strong) {
          font-weight: 700;
        }

        .cs-card__signature {
          margin-top: 4px;
          margin-bottom: 24px; /* required 24px bottom spacing */
        }
        .cs-card__signature-line1 {
          font-weight: 600;
          color: #101214;
        }
        .cs-card__signature-line2 {
          color: #555c63;
        }

        .cs-card__platforms {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 14px;
          align-items: center;
        }
        .cs-card__platform {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 999px;
          background: #fafbfc;
          color: #2b2f35;
          font-size: 13px;
          line-height: 1;
        }
        .cs-card__platform-icon {
          width: 16px;
          height: 16px;
          object-fit: contain;
        }
        .cs-card__platform-label {
          text-transform: capitalize;
        }

        .cs-card__actions {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .cs-card__link {
          color: #0b65c2;
          text-decoration: underline;
          font-weight: 600;
        }
        .cs-card__button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid #0b65c2;
          color: #0b65c2;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .cs-card__button:hover {
          background: #0b65c2;
          color: #fff;
        }
      `}</style>
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
function humanizePlatform(p: Platform): string {
    switch (p) {
        case 'compose-multi-platform':
            return 'Compose Multiplatform';
        case 'frontend':
            return 'Frontend';
        case 'backend':
            return 'Backend';
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