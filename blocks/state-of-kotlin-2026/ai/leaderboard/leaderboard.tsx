import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { KOTLIN_BENCHMARK_URL } from '@/blocks/benchmark/constants';
import {
    BenchGroupRow,
    currentEdition,
    formatBenchLongDate,
    groupRows,
    isGroupedEdition,
    TOP_SCORE_COUNT,
    twoDecimals,
} from '@/utils/benchmark-leaderboard';

import styles from './leaderboard.module.css';

export const LEADERBOARD_ROW_COUNT = 5;

const LEADERBOARD_LABEL = 'The Kotlin Benchmark Leaderboard';
const RANK_COLUMN_LABEL = '#';
const SETUP_COLUMN_LABEL = 'Setup (Agent + LLM)';
const BENCHMARK_LINK_LABEL = 'kotlinlang.org/benchmark';

interface LeaderboardColumn {
    key: Exclude<keyof BenchGroupRow, 'setup'>;
    label: string;
    format: (value: number) => string;
}

const COLUMNS: LeaderboardColumn[] = [
    { key: 'resolutionRate', label: 'Resolution Rate', format: (value) => `${value}%` },
    { key: 'cost', label: 'Avg. Cost / Task', format: (value) => `$${twoDecimals(value)}` },
    { key: 'tokens', label: 'Avg. Tokens / Task', format: twoDecimals },
    { key: 'latency', label: 'Avg. Latency / Task', format: (value) => `${value}m` },
];

// The report shows the all-tasks view of the current (grouped) leaderboard.
const topRows: BenchGroupRow[] = isGroupedEdition(currentEdition)
    ? groupRows(currentEdition, 'all').slice(0, LEADERBOARD_ROW_COUNT)
    : [];

const SNAPSHOT_DATE = formatBenchLongDate(currentEdition.date);

export const BenchmarkLeaderboard: FC = () => {
    const textCn = useTextStyles();

    return (
        <div className={styles.wrapper} data-testid="sok-ai-leaderboard">
            <div className={styles.tableArea}>
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
                                            {column.format(row[column.key])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className={cn(styles.caption, textCn('rs-text-3'))} data-testid="sok-ai-leaderboard-caption">
                Leaderboard snapshot as of <span className={styles.captionDate}>{SNAPSHOT_DATE}</span>. For the latest
                results, see{' '}
                <a className={textCn('rs-link')} href={KOTLIN_BENCHMARK_URL}>
                    {BENCHMARK_LINK_LABEL}
                </a>
            </p>
        </div>
    );
};
