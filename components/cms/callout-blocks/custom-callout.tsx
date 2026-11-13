import React, { type ReactNode } from 'react';
import { ThemeProvider } from '@rescui/ui-contexts';
import type { ContentNode } from '../../../utils/cms/content';

type SectionNode = Extract<ContentNode, { kind: 'section' }>;

/**
 * Pair 4 — in-page sections that need customisation by the web team. Until the requested custom
 * implementation lands, BLUE and PINK fall back to left-aligned copy on the default custom-section
 * background so the content stays presentable.
 */
export function CustomCallout({ node, children }: { node: SectionNode; children: ReactNode }) {
    const className = ['nw-section', 'nw-callout', 'nw-custom-callout', `nw-theme-${node.theme}`].join(' ');

    return (
        <ThemeProvider theme={node.scheme}>
            <section id={`b-${node.id}`} className={className}>
                <div className="nw-container">{children}</div>
            </section>
        </ThemeProvider>
    );
}
