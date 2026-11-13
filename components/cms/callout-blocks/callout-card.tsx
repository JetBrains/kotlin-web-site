import React, { type ReactNode } from 'react';
import { ThemeProvider } from '@rescui/ui-contexts';
import type { ContentNode } from '../../../utils/cms/content';
import { bannerStyle } from './banner-style';

type CalloutNode = Extract<ContentNode, { kind: 'callout' }>;

/** Call-out colors that center their copy, and the hero pair that keeps the light shade over its banners. */
const CENTERED_THEMES = new Set(['orange', 'green']);
const SHADED_THEMES = new Set(['red', 'orange']);

/**
 * A call-out nested inside another call-out or column: per the styling guidelines its background —
 * the page's banner images or its theme colour — is kept to this card instead of the page width.
 */
export function CalloutCard({ node, children }: { node: CalloutNode; children: ReactNode }) {
    const style = bannerStyle(node.banners);
    const className = [
        'nw-callout',
        'nw-callout-card',
        `nw-theme-${node.theme}`,
        CENTERED_THEMES.has(node.theme) && 'nw-align-center',
        SHADED_THEMES.has(node.theme) && 'nw-hero-shade',
        style && 'nw-callout-banner',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <ThemeProvider theme={node.scheme}>
            <div id={`b-${node.id}`} className={className} style={style}>
                {children}
            </div>
        </ThemeProvider>
    );
}
