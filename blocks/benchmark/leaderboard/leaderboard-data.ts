import { BenchColumnKey, BenchRow, formatBenchDate, twoDecimals } from '@/utils/benchmark-leaderboard';

export {
    currentEdition,
    formatBenchDate,
    notice,
    rows,
    toEdition,
    twoDecimals,
    TOP_SCORE_COUNT,
} from '@/utils/benchmark-leaderboard';
export type { BenchColumnKey, BenchEdition, BenchRow } from '@/utils/benchmark-leaderboard';

export interface BenchColumn {
    key: BenchColumnKey;
    label: string;
    hint: string;
    format?: (value: BenchRow[BenchColumnKey]) => string;
    /** Shown only when at least one row of the edition has a value for it. */
    optional?: boolean;
}

export const SETUP_COLUMN_LABEL = 'Setup (Agent + LLM) proprietary' as const;

/** Placeholder for an optional value a row doesn't have. */
export const MISSING_VALUE = '—' as const;

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
    {
        key: 'cost',
        label: 'Avg. cost ($)',
        hint: 'Average cost of a full run in USD',
        format: twoDecimals,
        optional: true,
    },
    { key: 'date', label: 'Date', hint: 'Evaluation date', format: formatBenchDate },
];

/** The columns an edition actually has data for: older editions predate the optional ones. */
export const columnsFor = (rows: BenchRow[]): BenchColumn[] =>
    columns.filter((column) => !column.optional || rows.some((row) => row[column.key] !== undefined));
