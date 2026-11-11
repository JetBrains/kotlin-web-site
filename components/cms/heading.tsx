import React from 'react';
import { useTextStyles } from '@rescui/typography';
import type { ContentNode } from '../../utils/cms/content';
import { RichTextView } from './rich-text';

type HeadingNode = Extract<ContentNode, { kind: 'heading' }>;
type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4';

export function Heading({ node, hero }: { node: HeadingNode; hero: boolean }) {
    const textCn = useTextStyles();
    const Tag = `h${node.level}` as HeadingTag;
    const style =
        hero && node.level === 1
            ? 'rs-hero'
            : hero && node.level === 3
            ? 'rs-subtitle-1'
            : (`rs-h${node.level}` as 'rs-h1' | 'rs-h2' | 'rs-h3' | 'rs-h4');

    return (
        <Tag id={`b-${node.id}`} className={`nw-heading ${textCn(style)}`}>
            <RichTextView text={node.text} />
        </Tag>
    );
}
