import React from 'react';
import type { ContentNode } from '../../utils/cms/content';
import { Blocks } from './blocks';

type GridNode = Extract<ContentNode, { kind: 'grid' }>;

export function Grid({ node, hero }: { node: GridNode; hero: boolean }) {
    const template = node.columns.map((column) => `${column.ratio}fr`).join(' ');

    return (
        <div id={`b-${node.id}`} className="nw-grid" style={{ gridTemplateColumns: template }}>
            {node.columns.map((column) => (
                <div key={column.id} id={`b-${column.id}`} className="nw-column">
                    <Blocks nodes={column.children} hero={hero} />
                </div>
            ))}
        </div>
    );
}
