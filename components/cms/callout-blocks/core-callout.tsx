import React, { type ReactNode } from 'react';
import { ThemeProvider } from '@rescui/ui-contexts';
import type { ContentNode } from '../../../utils/cms/content';

type SectionNode = Extract<ContentNode, { kind: 'section' }>;

/**
 * Pair 2 — common core in-page sections. GREY shows the near-white background and PURPLE the subtle
 * lavender gradient from the styling spec; both keep the copy left-aligned.
 */
export function CoreCallout({ node, children }: { node: SectionNode; children: ReactNode }) {
    const className = ['nw-section', 'nw-callout', 'nw-core-callout', `nw-theme-${node.theme}`].join(' ');

    return (
        <ThemeProvider theme={node.scheme}>
            <section id={`b-${node.id}`} className={className}>
                <div className="ktl-layout ktl-layout--center">
                    <div className="nw-container ktl-container">{children}</div>
                </div>
            </section>
        </ThemeProvider>
    );
}
