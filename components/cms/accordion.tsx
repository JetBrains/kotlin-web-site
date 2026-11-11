import React from 'react';
import { Accordion, Collapse } from '@rescui/collapse';
import type { ContentNode } from '../../utils/cms/content';
import { Blocks } from './blocks';
import { RichTextView } from './rich-text';

type AccordionNode = Extract<ContentNode, { kind: 'accordion' }>;

export function CmsAccordion({ node, hero }: { node: AccordionNode; hero: boolean }) {
    return (
        <Accordion className="nw-accordion" size="m" icon="right-plus" borderBottom>
            {node.items.map((item) => (
                <Collapse
                    key={item.id}
                    id={`b-${item.id}`}
                    className="nw-toggle"
                    itemKey={item.id}
                    title={<RichTextView text={item.title} />}
                >
                    <Blocks nodes={item.children} hero={hero} />
                </Collapse>
            ))}
        </Accordion>
    );
}
