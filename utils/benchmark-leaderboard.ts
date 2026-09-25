import leaderboardRaw from '../data/benchmark/leaderboard.yml';

/**
 * A single leaderboard entry
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

/**
 * Show at least two decimal places without rounding
 */
export const twoDecimals = (value: BenchRow[BenchColumnKey]): string => {
    const [whole, fraction = ''] = String(Number(value)).split('.');
    return `${whole}.${fraction.padEnd(2, '0')}`;
};

/** `2026-05-06` -> `06.05.2026 */
export const formatBenchDate = (value: BenchRow[BenchColumnKey]): string => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    return match ? `${match[3]}.${match[2]}.${match[1]}` : String(value);
};

const raw = leaderboardRaw as { rows?: BenchRow[]; notice?: string };

export const notice: string | undefined = raw.notice;

const rawRows: BenchRow[] = raw.rows ?? [];

export const rows: BenchRow[] = [...rawRows]
    .map((row) => ({ ...row, date: String(row.date).slice(0, 10) }))
    .sort((a, b) => b.resolutionRate - a.resolutionRate || a.tokens - b.tokens);

/**
 * The most recent evaluation in the data, as `Month D` — the "snapshot as of …" date the
 * report prints under its excerpt.
 */
export const snapshotDate: string = (() => {
    const latest = rows.map((row) => row.date).sort()[rows.length - 1];
    const parsed = latest ? new Date(`${latest}T00:00:00Z`) : null;

    return parsed && !isNaN(parsed.getTime())
        ? parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })
        : '';
})();
