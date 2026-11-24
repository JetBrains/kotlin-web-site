import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Tooltip } from '@rescui/tooltip';
import { InfoOutlineIcon } from '@rescui/icons';

import { TOP_SCORE_COUNT } from '@/utils/benchmark-leaderboard';

import styles from '../leaderboard.module.css';
import { BenchColumn, BenchTableRow, MISSING_VALUE } from '../leaderboard-data';

export interface BenchmarkTableProps<Row extends BenchTableRow> {
    columns: BenchColumn<Row>[];
    rows: Row[];
    setupLabel: string;
    notice?: string;
}

/**
 * The leaderboard table shared by every methodology version
 */
export function BenchmarkTable<Row extends BenchTableRow>({ columns, rows, setupLabel, notice }: BenchmarkTableProps<Row>) {
    const textCn = useTextStyles();

    return (
        <div className={styles.card}>
            <div className={styles.scroll} data-testid="bench-scroll">
                <table className={styles.table} data-testid="bench-leaderboard-table">
                    <thead>
                        <tr>
                            <th
                                className={cn(styles.th, styles.thSetup, textCn('rs-text-3'))}
                                scope="col"
                                data-testid="bench-setup-header"
                            >
                                {setupLabel}
                            </th>
                            {columns.map((column) => (
                                <th key={column.key} className={cn(styles.th, textCn('rs-text-3'))} scope="col">
                                    <Tooltip content={column.hint} placement="top">
                                        <span
                                            className={styles.thLabel}
                                            data-testid="bench-col-header"
                                            data-col={column.key}
                                        >
                                            <span className={styles.thTitle}>
                                                {column.label}
                                                {column.sublabel && (
                                                    <span className={styles.thSub} data-testid="bench-col-sublabel">
                                                        {column.sublabel}
                                                    </span>
                                                )}
                                            </span>
                                            <InfoOutlineIcon className={styles.infoIcon} size="s" />
                                        </span>
                                    </Tooltip>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {notice && (
                        <tbody>
                            <tr className={styles.noticeRow} data-testid="bench-notice">
                                <td className={cn(styles.td, styles.tdSetup)}>
                                    <div className={styles.setup}>
                                        <span className={cn(styles.rank, styles.noticeRank, textCn('rs-text-3'))}>
                                            ?
                                        </span>
                                        <span className={cn(styles.noticeName, textCn('rs-text-2'))}>{notice}</span>
                                    </div>
                                </td>
                                {columns.map((column) => (
                                    <td key={column.key} className={styles.td} />
                                ))}
                            </tr>
                        </tbody>
                    )}
                    <tbody>
                        {rows.map((row, index) => (
                            <tr
                                key={row.setup}
                                className={cn(styles.row, { [styles.rowTop]: index < TOP_SCORE_COUNT })}
                                data-testid="bench-row"
                            >
                                <td className={cn(styles.td, styles.tdSetup)}>
                                    <div className={styles.setup}>
                                        <span className={cn(styles.rank, textCn('rs-text-3'))} data-testid="bench-rank">
                                            {index + 1}
                                        </span>
                                        <span
                                            className={cn(styles.setupName, textCn('rs-text-2'))}
                                            data-testid="bench-setup"
                                        >
                                            {row.setup}
                                        </span>
                                    </div>
                                </td>
                                {columns.map((column) => {
                                    const value = row[column.key];
                                    const text =
                                        value === undefined
                                            ? MISSING_VALUE
                                            : column.format
                                            ? column.format(value)
                                            : String(value);

                                    return (
                                        <td
                                            key={column.key}
                                            className={cn(styles.td, styles.num, textCn('rs-text-2'))}
                                            data-col={column.key}
                                        >
                                            {column.emphasis ? <span className={styles.rateValue}>{text}</span> : text}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
