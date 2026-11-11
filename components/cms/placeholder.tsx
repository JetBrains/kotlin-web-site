import React from 'react';
import type { ContentNode } from '../../utils/cms/content';
import { useIsDev } from './dev-context';

type UnsupportedNode = Extract<ContentNode, { kind: 'unsupported' }>;

/** Dashed box linking to the source block in Notion. Rendered in development only; production skips the block. */
export function Placeholder({ node }: { node: UnsupportedNode }) {
    const isDev = useIsDev();
    if (!isDev) return null;

    return (
        <div id={`b-${node.id}`} className="nw-placeholder" data-testid="cms-unsupported-block">
            <span>Unsupported block: {node.blockType}</span>
            <a href={node.notionUrl} target="_blank" rel="noreferrer">
                Open in Notion
            </a>
        </div>
    );
}
