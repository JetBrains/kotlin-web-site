import leaderboardRaw from '../data/benchmark/leaderboard.yml';

/**
 * A single leaderboard entry. The data is sourced from
 * data/benchmark/leaderboard.yml (rows only) — see that file to update
 * the numbers or wire up an automated integration.
 *
 * Shared between the Kotlin Benchmark landing page (`blocks/benchmark/leaderboard`,
 * the full table) and the State of Kotlin 2026 report (`blocks/state-of-kotlin-2026/ai`,
 * a short top-N excerpt), so both always render the same numbers in the same shape.
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

/** How many leading rows are painted as the top-scoring group. */
export const TOP_SCORE_COUNT = 3;

export type BenchColumnKey = Exclude<keyof BenchRow, 'setup'>;

/**
 * Show at least two decimal places without rounding: trailing zeros are kept
 * (81.9 -> "81.90", 8.4 -> "8.40") while any extra precision is preserved as-is.
 */
export const twoDecimals = (value: BenchRow[BenchColumnKey]): string => {
    const [whole, fraction = ''] = String(Number(value)).split('.');
    return `${whole}.${fraction.padEnd(2, '0')}`;
};

/** `2026-05-06` -> `06.05.2026`; anything that is not an ISO date is passed through. */
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
 * report prints under its excerpt. Derived so the caption cannot go stale on a data update.
 */
export const snapshotDate: string = (() => {
    const latest = rows.map((row) => row.date).sort()[rows.length - 1];
    const parsed = latest ? new Date(`${latest}T00:00:00Z`) : null;

    return parsed && !isNaN(parsed.getTime())
        ? parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })
        : '';
})();
