import React, { type ReactNode } from 'react';
import { ThemeProvider } from '@rescui/ui-contexts';
import type { ContentNode } from '../../../utils/cms/content';
import { bannerStyle } from './banner-style';

type SectionNode = Extract<ContentNode, { kind: 'section' }>;

/**
 * Pair 1 — primary landing-page hero sections. RED shows left-aligned copy and ORANGE centred copy,
 * both in the light scheme: dark copy on the page's `<COLOR> L/M/S Banner` images with a light
 * readability shade over them or, when these are not set, on the default hero graphic at full
 * strength over the white section.
 */
export function HeroCallout({ node, children }: { node: SectionNode; children: ReactNode }) {
    const style = bannerStyle(node.banners);
    const className = [
        'nw-section',
        'nw-callout',
        'nw-hero-callout',
        `nw-theme-${node.theme}`,
        node.theme === 'orange' && 'nw-align-center',
        node.hero && 'nw-hero',
        style && 'nw-callout-banner',
        'nw-hero-shade',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <ThemeProvider theme={node.scheme}>
            <section id={`b-${node.id}`} className={className} style={style}>
                <div className="ktl-layout ktl-layout--center">
                    <div className="nw-container ktl-container">{children}</div>
                </div>
            </section>
        </ThemeProvider>
    );
}
