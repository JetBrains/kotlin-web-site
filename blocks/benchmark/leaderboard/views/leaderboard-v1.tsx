import React, { useMemo } from 'react';

import { BenchmarkTable } from './benchmark-table';
import {
    BenchColumn,
    BenchEditionV1,
    BenchRow,
    columnsFor,
    formatBenchDate,
    SETUP_COLUMN_LABEL_V1,
    twoDecimals,
} from '../leaderboard-data';

const COLUMNS: BenchColumn<BenchRow>[] = [
    { key: 'submitted', label: 'Submitted', hint: 'Total tasks submitted for evaluation' },
    { key: 'resolved', label: 'Resolved', hint: 'Tasks fully resolved across all runs' },
    {
        key: 'resolutionRate',
        label: 'Resolution rate (%)',
        hint: 'Percentage of submitted tasks that were resolved',
        format: twoDecimals,
        emphasis: true,
    },
    { key: 'tokens', label: 'Avg. tokens (M)', hint: 'Average token consumption for a full run', format: twoDecimals },
    { key: 'latency', label: 'Avg. latency', hint: 'Average time to solve all tasks across runs' },
    {
        key: 'cost',
        label: 'Avg. cost ($)',
        hint: 'Average cost of a full run in USD',
        format: twoDecimals,
        optional: true,
    },
    { key: 'date', label: 'Date', hint: 'Evaluation date', format: formatBenchDate },
];

export interface LeaderboardV1Props {
    edition: BenchEditionV1;
}

export function LeaderboardV1({ edition }: LeaderboardV1Props) {
    const columns = useMemo(() => columnsFor(COLUMNS, edition.rows), [edition.rows]);

    return (
        <BenchmarkTable
            columns={columns}
            rows={edition.rows}
            setupLabel={SETUP_COLUMN_LABEL_V1}
            notice={edition.notice}
        />
    );
}
