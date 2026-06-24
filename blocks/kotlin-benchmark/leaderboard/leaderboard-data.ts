import leaderboardRaw from '../../../data/kotlin-benchmark/leaderboard.yml';

/**
 * A single leaderboard entry. The data is sourced from
 * data/kotlin-benchmark/leaderboard.yml (rows only) — see that file to update
 * the numbers or wire up an automated integration.
 */
export interface BenchRow {
    setup: string;
    submitted: number;
    resolved: number;
    resolutionRate: number;
    tokens: number;
    latency: number;
    date: string;
}

export const TOP_SCORE_COUNT = 3;

export type BenchColumnKey = Exclude<keyof BenchRow, 'setup'>;

export interface BenchColumn {
    key: BenchColumnKey;
    label: string;
    hint: string;
    format?: (value: BenchRow[BenchColumnKey]) => string;
}

export const SETUP_COLUMN_LABEL = 'Setup (Agent + LLM) proprietary' as const;

const oneDecimal = (value: BenchRow[BenchColumnKey]): string => Number(value).toFixed(1);

const formatDate = (value: BenchRow[BenchColumnKey]): string => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    return match ? `${match[3]}.${match[2]}.${match[1]}` : String(value);
};

export const columns: BenchColumn[] = [
    { key: 'submitted', label: 'Submitted', hint: 'Total tasks submitted for evaluation' },
    { key: 'resolved', label: 'Resolved', hint: 'Tasks fully resolved across all runs' },
    {
        key: 'resolutionRate',
        label: 'Resolution rate (%)',
        hint: 'Percentage of submitted tasks that were resolved',
        format: oneDecimal,
    },
    { key: 'tokens', label: 'Avg tokens (M)', hint: 'Average token consumption for a full run', format: oneDecimal },
    { key: 'latency', label: 'Avg latency (h)', hint: 'Average time to solve all tasks across runs', format: oneDecimal },
    { key: 'date', label: 'Date', hint: 'Evaluation date', format: formatDate },
];

const rawRows: BenchRow[] = (leaderboardRaw as { rows?: BenchRow[] }).rows ?? [];

export const rows: BenchRow[] = [...rawRows]
    .map((row) => ({ ...row, date: String(row.date).slice(0, 10) }))
    .sort((a, b) => b.resolutionRate - a.resolutionRate);

export const maxResolutionRate: number = rows.length
    ? Math.max(...rows.map((row) => row.resolutionRate))
    : 0;
