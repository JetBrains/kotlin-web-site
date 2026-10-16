import leaderboardRaw from '../data/benchmark/leaderboard.yml';

/**
 * A single leaderboard entry. Optional fields are columns that only newer
 * editions carry; an edition without them simply doesn't show the column.
 */
export interface BenchRow {
    setup: string;
    submitted: number;
    resolved: number;
    resolutionRate: number;
    tokens: number;
    latency: string;
    /** Average cost of a full run, in USD. Introduced with the 2.0 edition. */
    cost?: number;
    date: string;
}

/**
 * One published leaderboard: the current results, or an archived edition
 * from data/benchmark/archive/.
 */
export interface BenchEdition {
    /** Publication date: the day this edition went live on kotlinlang.org, not the date of any run. */
    date: string;
    /** Methodology version the results were produced with. */
    methodology: number;
    notice?: string;
    rows: BenchRow[];
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

/**
 * Ranking order for every edition: resolution rate first, fewer tokens on a tie.
 * Row dates are normalised because a YAML loader may hand back a Date object.
 */
export const prepareRows = (rawRows: BenchRow[] | undefined): BenchRow[] =>
    [...(rawRows ?? [])]
        .map((row) => ({ ...row, date: String(row.date).slice(0, 10) }))
        .sort((a, b) => b.resolutionRate - a.resolutionRate || a.tokens - b.tokens);

/**
 * Normalise a parsed YAML edition, whatever loaded it (webpack or fs).
 * `notice` is omitted rather than set to undefined: editions travel through
 * getStaticProps, which refuses to serialize an undefined value.
 */
export const toEdition = (raw: unknown): BenchEdition => {
    const { date, methodology, notice, rows } = (raw ?? {}) as {
        date?: unknown;
        methodology?: unknown;
        notice?: string;
        rows?: BenchRow[];
    };
    return {
        date: String(date ?? '').slice(0, 10),
        methodology: Number(methodology ?? 1),
        rows: prepareRows(rows),
        ...(notice ? { notice } : {}),
    };
};

/** The leaderboard currently published on /benchmark/. */
export const currentEdition: BenchEdition = toEdition(leaderboardRaw);

export const notice: string | undefined = currentEdition.notice;

export const rows: BenchRow[] = currentEdition.rows;

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
