import React from 'react';
import { useTextStyles } from '@rescui/typography';
import type { ContentNode } from '../../utils/cms/content';
import { Blocks } from './blocks';
import { RichTextView } from './rich-text';

type ListNode = Extract<ContentNode, { kind: 'list' }>;

/** Bulleted / numbered list. The list takes the id of its first item; every item keeps its own `b-<id>`. */
export function List({ node, hero }: { node: ListNode; hero: boolean }) {
    const textCn = useTextStyles();
    const Tag = node.ordered ? 'ol' : 'ul';

    return (
        <Tag id={`b-${node.id}-list`} className={`nw-list ${textCn('rs-text-1')}`}>
            {node.items.map((item) => (
                <li key={item.id} id={`b-${item.id}`} className="nw-list-item">
                    <RichTextView text={item.text} />
                    {item.children.length > 0 && <Blocks nodes={item.children} hero={hero} />}
                </li>
            ))}
        </Tag>
    );
}
