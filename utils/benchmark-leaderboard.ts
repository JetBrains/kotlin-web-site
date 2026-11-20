import leaderboardRaw from '../data/benchmark/leaderboard.yml';

/**
 * A single methodology-1 leaderboard entry
 */
export interface BenchRow {
    setup: string;
    submitted: number;
    resolved: number;
    resolutionRate: number;
    tokens: number;
    latency: string;
    cost?: number;
    date: string;
}

/**
 * Results of one setup on one task group (methodology 2+)
 */
export interface BenchMetrics {
    resolutionRate: number;
    cost: number;
    tokens: number;
    latency: number;
    steps?: number;
}

export type BenchTaskGroup = 'all' | 'open' | 'closed';

export const BENCH_TASK_GROUPS: readonly BenchTaskGroup[] = ['all', 'open', 'closed'];

export type BenchGroupedRow = { setup: string } & Record<BenchTaskGroup, BenchMetrics>;

export type BenchGroupRow = { setup: string } & BenchMetrics;

interface BenchEditionBase {
    date: string;
    methodology: number;
}

export interface BenchEditionV1 extends BenchEditionBase {
    notice?: string;
    rows: BenchRow[];
}

export interface BenchEditionV2 extends BenchEditionBase {
    tasks: Record<BenchTaskGroup, number>;
    rows: BenchGroupedRow[];
}

export type BenchEdition = BenchEditionV1 | BenchEditionV2;

export const GROUPED_METHODOLOGY = 2;

export const isGroupedEdition = (edition: BenchEdition): edition is BenchEditionV2 =>
    edition.methodology >= GROUPED_METHODOLOGY;

export const TOP_SCORE_COUNT = 3;

export type BenchColumnKey = Exclude<keyof BenchRow, 'setup'>;

export const formatDecimals =
    (minDecimals: number) =>
    (value: unknown): string => {
        const [whole, fraction = ''] = String(Number(value)).split('.');
        return `${whole}.${fraction.padEnd(minDecimals, '0')}`;
    };

export const oneDecimals = formatDecimals(1);

export const twoDecimals = formatDecimals(2);

/** `2026-05-06` -> `06.05.2026 */
export const formatBenchDate = (value: unknown): string => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    return match ? `${match[3]}.${match[2]}.${match[1]}` : String(value);
};

/** `2026-11-20` -> `November 20, 2026`; for prose such as "snapshot as of …". */
export const formatBenchLongDate = (value: string): string => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return isNaN(parsed.getTime())
        ? value
        : parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};

/** Ranking order for every edition and view: resolution rate first, fewer tokens on a tie. */
const byRanking = (a: { resolutionRate: number; tokens: number }, b: { resolutionRate: number; tokens: number }) =>
    b.resolutionRate - a.resolutionRate || a.tokens - b.tokens;

const byGroupRanking = (a: BenchMetrics, b: BenchMetrics) =>
    b.resolutionRate - a.resolutionRate || a.cost - b.cost;

/**
 * Ranked methodology-1 rows. Row dates are normalised because a YAML loader may hand back a Date object.
 */
export const prepareRows = (rawRows: BenchRow[] | undefined): BenchRow[] =>
    [...(rawRows ?? [])].map((row) => ({ ...row, date: String(row.date).slice(0, 10) })).sort(byRanking);

/** The rows of a methodology-2+ edition for one task group, ranked. */
export const groupRows = (edition: BenchEditionV2, group: BenchTaskGroup): BenchGroupRow[] =>
    edition.rows.map((row) => ({ setup: row.setup, ...row[group] })).sort(byGroupRanking);

/**
 * Normalise a parsed YAML edition, whatever loaded it (webpack or fs).
 * `notice` is omitted rather than set to undefined: editions travel through
 * getStaticProps, which refuses to serialize an undefined value.
 */
export const toEdition = (raw: unknown): BenchEdition => {
    const { date, methodology, notice, tasks, rows } = (raw ?? {}) as {
        date?: unknown;
        methodology?: unknown;
        notice?: string;
        tasks?: Record<BenchTaskGroup, number>;
        rows?: unknown[];
    };
    const base = { date: String(date ?? '').slice(0, 10), methodology: Number(methodology ?? 1) };

    if (base.methodology >= GROUPED_METHODOLOGY) {
        return {
            ...base,
            tasks: { all: 0, open: 0, closed: 0, ...tasks },
            rows: (rows ?? []) as BenchGroupedRow[],
        };
    }

    return {
        ...base,
        rows: prepareRows(rows as BenchRow[] | undefined),
        ...(notice ? { notice } : {}),
    };
};

/** The leaderboard currently published on /benchmark/. */
export const currentEdition: BenchEdition = toEdition(leaderboardRaw);
