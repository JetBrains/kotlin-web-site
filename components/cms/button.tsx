import React from 'react';
import { Button } from '@rescui/button';
import type { ContentNode } from '../../utils/cms/content';

type ButtonNode = Extract<ContentNode, { kind: 'button' }>;

export function CmsButton({ node, hero }: { node: ButtonNode; hero: boolean }) {
    return (
        <Button
            id={`b-${node.id}`}
            className="nw-button"
            mode="rock"
            size={hero ? 'l' : 'm'}
            href={node.href}
            {...(node.external ? { target: '_blank' as const, rel: 'noreferrer' } : {})}
        >
            {node.label}
        </Button>
    );
}
