import React from 'react';
import type { ContentNode } from '../../utils/cms/content';
import { Blocks } from './blocks';

type GridNode = Extract<ContentNode, { kind: 'grid' }>;

const GRID_SPANS = 12;

/**
 * Notion columns come as arbitrary ratios (normalized to sum to 1), while the site grid has 12
 * fixed spans. Rounds every ratio to a whole span with the largest-remainder method, so the
 * spans always add up to 12; every column keeps at least 1 span.
 */
function spansFor(ratios: number[]): number[] {
    const exact = ratios.map((ratio) => Math.max(1, ratio * GRID_SPANS));
    const spans = exact.map((value) => Math.floor(value));
    let leftover = GRID_SPANS - spans.reduce((sum, span) => sum + span, 0);

    const byRemainder = exact
        .map((value, index) => ({ index, remainder: value % 1 }))
        .sort((a, b) => b.remainder - a.remainder || a.index - b.index);

    for (const { index } of byRemainder) {
        if (leftover <= 0) break;
        spans[index] += 1;
        leftover -= 1;
    }

    return spans;
}

export function Grid({ node, hero }: { node: GridNode; hero: boolean }) {
    const spans = spansFor(node.columns.map((column) => column.ratio));

    return (
        <div id={`b-${node.id}`} className="ktl-row">
            {node.columns.map((column, index) => (
                <div key={column.id} id={`b-${column.id}`} className={`ktl-col-12 ktl-col-sm-${spans[index]}`}>
                    <Blocks nodes={column.children} hero={hero} />
                </div>
            ))}
        </div>
    );
}
