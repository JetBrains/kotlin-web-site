import React, { type ReactNode } from 'react';
import type { ContentNode } from '../../../utils/cms/content';
import { Section } from '../section';
import { CoreCallout } from './core-callout';
import { CustomCallout } from './custom-callout';
import { HeroCallout } from './hero-callout';
import { HighlightCallout } from './highlight-callout';

type SectionNode = Extract<ContentNode, { kind: 'section' }>;

/** Routes every top-level Notion call-out to the template its color is reserved for. */
export function CalloutSection({ node, children }: { node: SectionNode; children: ReactNode }) {
    switch (node.theme) {
        case 'red':
        case 'orange':
            return <HeroCallout node={node}>{children}</HeroCallout>;
        case 'gray':
        case 'purple':
            return <CoreCallout node={node}>{children}</CoreCallout>;
        case 'yellow':
        case 'green':
            return <HighlightCallout node={node}>{children}</HighlightCallout>;
        case 'blue':
        case 'pink':
            return <CustomCallout node={node}>{children}</CustomCallout>;
        default:
            return <Section node={node}>{children}</Section>;
    }
}
