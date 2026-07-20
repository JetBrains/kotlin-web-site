import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Tooltip } from '@rescui/tooltip';
import { InfoOutlineIcon } from '@rescui/icons';
import styles from './leaderboard.module.css';
import { columns, notice, rows, SETUP_COLUMN_LABEL, TOP_SCORE_COUNT, twoDecimals } from './leaderboard-data';

function RateCell({ value, textCn }: { value: number; textCn: ReturnType<typeof useTextStyles> }) {
    return <span className={cn(styles.rateValue, textCn('rs-text-2'))}>{twoDecimals(value)}</span>;
}

export function Leaderboard() {
    const textCn = useTextStyles();

    return (
        <section className={cn(styles.section, 'ktl-layout', 'ktl-layout--center')} data-testid="bench-leaderboard">
            <div className={styles.card}>
                <div className={styles.scroll} data-testid="bench-scroll">
                    <table className={styles.table} data-testid="bench-leaderboard-table">
                        <thead>
                            <tr>
                                <th className={cn(styles.th, styles.thSetup, textCn('rs-text-3'))} scope="col">
                                    {SETUP_COLUMN_LABEL}
                                </th>
                                {columns.map((column) => (
                                    <th key={column.key} className={cn(styles.th, textCn('rs-text-3'))} scope="col">
                                        <Tooltip content={column.hint} placement="top">
                                            <span
                                                className={styles.thLabel}
                                                data-testid="bench-col-header"
                                                data-col={column.key}
                                            >
                                                {column.label}
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
                                            <span className={cn(styles.rank, styles.noticeRank, textCn('rs-text-3'))}>?</span>
                                            <span className={cn(styles.noticeName, textCn('rs-text-2'))}>{notice}</span>
                                        </div>
                                    </td>
                                    {columns.map((col) => (
                                        <td key={col.key} className={styles.td} />
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
                                            <span
                                                className={cn(styles.rank, textCn('rs-text-3'))}
                                                data-testid="bench-rank"
                                            >
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
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className={cn(styles.td, styles.num, textCn('rs-text-2'))}
                                            data-col={column.key}
                                        >
                                            {column.key === 'resolutionRate' ? (
                                                <RateCell value={row.resolutionRate} textCn={textCn} />
                                            ) : column.format ? (
                                                column.format(row[column.key])
                                            ) : (
                                                String(row[column.key])
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
