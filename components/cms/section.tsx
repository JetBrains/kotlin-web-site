import React, { type ReactNode } from 'react';
import { ThemeProvider } from '@rescui/ui-contexts';
import type { ContentNode } from '../../utils/cms/content';

type SectionNode = Extract<ContentNode, { kind: 'section' }>;

export function Section({ node, children }: { node: SectionNode; children: ReactNode }) {
    const className = ['nw-section', `nw-theme-${node.theme}`, node.hero && 'nw-hero'].filter(Boolean).join(' ');

    return (
        <ThemeProvider theme={node.scheme}>
            <section id={node.implicit ? undefined : `b-${node.id}`} className={className}>
                <div className="nw-container">{children}</div>
            </section>
        </ThemeProvider>
    );
}
