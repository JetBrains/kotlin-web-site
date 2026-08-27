import { BenchColumnKey, BenchRow, formatBenchDate, twoDecimals } from '@/utils/benchmark-leaderboard';

/** The rows, formatters and shared constants live in `utils/benchmark-leaderboard`. */
export { notice, rows, twoDecimals, TOP_SCORE_COUNT } from '@/utils/benchmark-leaderboard';
export type { BenchColumnKey, BenchRow } from '@/utils/benchmark-leaderboard';

export interface BenchColumn {
    key: BenchColumnKey;
    label: string;
    hint: string;
    format?: (value: BenchRow[BenchColumnKey]) => string;
}

export const SETUP_COLUMN_LABEL = 'Setup (Agent + LLM) proprietary' as const;

export const columns: BenchColumn[] = [
    { key: 'submitted', label: 'Submitted', hint: 'Total tasks submitted for evaluation' },
    { key: 'resolved', label: 'Resolved', hint: 'Tasks fully resolved across all runs' },
    {
        key: 'resolutionRate',
        label: 'Resolution rate (%)',
        hint: 'Percentage of submitted tasks that were resolved',
    },
    { key: 'tokens', label: 'Avg. tokens (M)', hint: 'Average token consumption for a full run', format: twoDecimals },
    { key: 'latency', label: 'Avg. latency', hint: 'Average time to solve all tasks across runs' },
    { key: 'date', label: 'Date', hint: 'Evaluation date', format: formatBenchDate },
];
