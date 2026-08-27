import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { KOTLIN_BENCHMARK_URL } from '@/blocks/benchmark/constants';
import {
    BenchColumnKey,
    BenchRow,
    formatBenchDate,
    notice,
    rows,
    snapshotDate,
    TOP_SCORE_COUNT,
    twoDecimals,
} from '@/utils/benchmark-leaderboard';

import styles from './leaderboard.module.css';

/**
 * How many rows the report shows. This is the short version of the full table on
 * /benchmark/, so it prints the leading setups only and links out for the rest.
 */
export const LEADERBOARD_ROW_COUNT = 5;

const LEADERBOARD_LABEL = 'The Kotlin Benchmark Leaderboard';
const RANK_COLUMN_LABEL = '#';
const SETUP_COLUMN_LABEL = 'Setup (Agent + LLM)';
const BENCHMARK_LINK_LABEL = 'kotlinlang.org/benchmark';

interface LeaderboardColumn {
    key: BenchColumnKey;
    label: string;
    format?: (value: BenchRow[BenchColumnKey]) => string;
}

/**
 * The report's own column set: shorter labels than the full table's, and the resolution rate
 * carries the unit in the cell because this header omits it. The values themselves go through
 * the same formatters as /benchmark/, so both tables always print the same numbers.
 */
const COLUMNS: LeaderboardColumn[] = [
    { key: 'submitted', label: 'Submitted' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'resolutionRate', label: 'Resolution Rate', format: (value) => `${twoDecimals(value)}%` },
    { key: 'tokens', label: 'Avg. Tokens (M)', format: twoDecimals },
    { key: 'latency', label: 'Avg. Latency' },
    { key: 'date', label: 'Date', format: formatBenchDate },
];

const topRows = rows.slice(0, LEADERBOARD_ROW_COUNT);

export const BenchmarkLeaderboard: FC = () => {
    const textCn = useTextStyles();

    return (
        <div className={styles.wrapper} data-testid="sok-ai-leaderboard">
            <div className={styles.tableArea}>
                {/*
                 * The table is the same width at every breakpoint and scrolls in place, so the
                 * box needs to be reachable and scrollable from the keyboard as well as by touch.
                 */}
                <div
                    className={styles.scroll}
                    data-testid="sok-ai-leaderboard-scroll"
                    role="region"
                    aria-label={LEADERBOARD_LABEL}
                    tabIndex={0}
                >
                    <table className={cn(styles.table, textCn('rs-text-3'))} data-testid="sok-ai-leaderboard-table">
                        <colgroup>
                            <col className={styles.colRank} />
                            <col className={styles.colSetup} />
                            {COLUMNS.map((column) => (
                                <col key={column.key} data-col={column.key} />
                            ))}
                        </colgroup>
                        <thead>
                            <tr>
                                <th className={styles.th} scope="col">
                                    {RANK_COLUMN_LABEL}
                                </th>
                                <th className={cn(styles.th, styles.thSetup)} scope="col">
                                    {SETUP_COLUMN_LABEL}
                                </th>
                                {COLUMNS.map((column) => (
                                    <th key={column.key} className={styles.th} scope="col">
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {notice && (
                                <tr data-testid="sok-ai-leaderboard-notice">
                                    <td className={cn(styles.td, styles.rank)}>?</td>
                                    <td className={cn(styles.td, styles.tdSetup)} colSpan={COLUMNS.length + 1}>
                                        <span className={styles.setupName}>{notice}</span>
                                    </td>
                                </tr>
                            )}
                            {topRows.map((row, index) => (
                                <tr
                                    key={row.setup}
                                    className={cn({ [styles.rowTop]: index < TOP_SCORE_COUNT })}
                                    data-testid="sok-ai-leaderboard-row"
                                >
                                    <td className={cn(styles.td, styles.rank)} data-testid="sok-ai-leaderboard-rank">
                                        {index + 1}
                                    </td>
                                    <td className={cn(styles.td, styles.tdSetup)} data-col="setup">
                                        <span className={styles.setupName} title={row.setup}>
                                            {row.setup}
                                        </span>
                                    </td>
                                    {COLUMNS.map((column) => (
                                        <td
                                            key={column.key}
                                            className={cn(styles.td, {
                                                [styles.rate]: column.key === 'resolutionRate',
                                            })}
                                            data-col={column.key}
                                        >
                                            {column.format ? column.format(row[column.key]) : String(row[column.key])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className={cn(styles.caption, textCn('rs-text-3'))} data-testid="sok-ai-leaderboard-caption">
                Leaderboard snapshot as of <span className={styles.captionDate}>{snapshotDate}</span>. For the latest
                results, see{' '}
                <a className={textCn('rs-link')} href={KOTLIN_BENCHMARK_URL}>
                    {BENCHMARK_LINK_LABEL}
                </a>
            </p>
        </div>
    );
};
