/** Any row the common table can render: a named setup ranked by resolution rate. */
export interface BenchTableRow {
    setup: string;
    resolutionRate: number;
}

/** One column of a leaderboard table. Each leaderboard version holds its own list. */
export interface BenchColumn<Row extends BenchTableRow> {
    key: Exclude<keyof Row, 'setup'> & string;
    label: string;
    sublabel?: string;
    hint: string;
    format?: (value: Row[keyof Row]) => string;
    /** Rendered as the headline value of the row (bold, white). */
    emphasis?: boolean;
    /** Shown only when at least one row of the edition has a value for it. */
    optional?: boolean;
}

export const SETUP_COLUMN_LABEL_V1 = 'Setup (Agent + LLM) proprietary' as const;
export const SETUP_COLUMN_LABEL_V2 = 'Setup (Agent + LLM)' as const;

/** Placeholder for an optional value a row doesn't have. */
export const MISSING_VALUE = '—' as const;

/** The columns an edition actually has data for: older editions predate the optional ones. */
export const columnsFor = <Row extends BenchTableRow>(columns: BenchColumn<Row>[], rows: Row[]): BenchColumn<Row>[] =>
    columns.filter((column) => !column.optional || rows.some((row) => row[column.key] !== undefined));
