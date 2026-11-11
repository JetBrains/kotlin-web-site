import React from 'react';
import { useTextStyles } from '@rescui/typography';
import type { ContentNode } from '../../utils/cms/content';
import { RichTextView } from './rich-text';

type ParagraphNode = Extract<ContentNode, { kind: 'paragraph' }>;

export function Paragraph({ node }: { node: ParagraphNode }) {
    const textCn = useTextStyles();

    return (
        <p id={`b-${node.id}`} className={`nw-text ${textCn('rs-text-1')}`}>
            <RichTextView text={node.text} />
        </p>
    );
}
