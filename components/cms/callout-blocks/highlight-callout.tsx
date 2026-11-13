import React, { type ReactNode } from 'react';
import { ThemeProvider } from '@rescui/ui-contexts';
import type { ContentNode } from '../../../utils/cms/content';
import { bannerStyle } from './banner-style';

type SectionNode = Extract<ContentNode, { kind: 'section' }>;

/**
 * Pair 3 — in-page highlight sections. YELLOW shows left-aligned copy and GREEN centred copy, both on
 * the page's `<COLOR> L/M/S Banner` images or, when these are not set, on the default highlight colour.
 */
export function HighlightCallout({ node, children }: { node: SectionNode; children: ReactNode }) {
    const style = bannerStyle(node.banners);
    const className = [
        'nw-section',
        'nw-callout',
        'nw-highlight-callout',
        `nw-theme-${node.theme}`,
        node.theme === 'green' && 'nw-align-center',
        style && 'nw-callout-banner',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <ThemeProvider theme={node.scheme}>
            <section id={`b-${node.id}`} className={className} style={style}>
                <div className="nw-container">{children}</div>
            </section>
        </ThemeProvider>
    );
}
