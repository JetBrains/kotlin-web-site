import React from 'react';
import type { ContentNode } from '../../utils/cms/content';
import { CmsAccordion } from './accordion';
import { CmsButton } from './button';
import { CalloutCard } from './callout-blocks/callout-card';
import { CalloutSection } from './callout-blocks/callout-section';
import { Gallery } from './gallery';
import { Grid } from './grid';
import { Heading } from './heading';
import { List } from './list';
import { Paragraph } from './paragraph';
import { Placeholder } from './placeholder';
import { RichTextView } from './rich-text';

/** Renders the normalized CMS content tree. Every element keeps its Notion block id as `b-<id>` for custom CSS. */
export function Blocks({ nodes, hero = false }: { nodes: ContentNode[]; hero?: boolean }) {
    return (
        <>
            {nodes.map((node) => {
                switch (node.kind) {
                    case 'section':
                        return (
                            <CalloutSection key={node.id} node={node}>
                                <Blocks nodes={node.children} hero={node.hero} />
                            </CalloutSection>
                        );
                    case 'callout':
                        return (
                            <CalloutCard key={node.id} node={node}>
                                <Blocks nodes={node.children} hero={hero} />
                            </CalloutCard>
                        );
                    case 'heading':
                        return <Heading key={node.id} node={node} hero={hero} />;
                    case 'paragraph':
                        return <Paragraph key={node.id} node={node} />;
                    case 'list':
                        return <List key={node.id} node={node} hero={hero} />;
                    case 'grid':
                        return <Grid key={node.id} node={node} hero={hero} />;
                    case 'button':
                        return <CmsButton key={node.id} node={node} hero={hero} />;
                    case 'image':
                        return (
                            <figure key={node.id} id={`b-${node.id}`} className="nw-image">
                                <img src={node.src} alt={node.alt} />
                                {node.caption && (
                                    <figcaption>
                                        <RichTextView text={node.caption} />
                                    </figcaption>
                                )}
                            </figure>
                        );
                    case 'divider':
                        return <hr key={node.id} id={`b-${node.id}`} className="nw-divider" />;
                    case 'gallery':
                        return <Gallery key={node.id} node={node} />;
                    case 'accordion':
                        return <CmsAccordion key={node.id} node={node} hero={hero} />;
                    case 'unsupported':
                        return <Placeholder key={node.id} node={node} />;
                    default:
                        return null;
                }
            })}
        </>
    );
}
