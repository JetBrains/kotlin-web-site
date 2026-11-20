import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import styles from './archive-link.module.css';
import { formatBenchDate } from '../leaderboard/leaderboard-data';
import { ARCHIVE_URL } from '../constants';

interface ArchiveLinkProps {
    /** Publication date of the leaderboard below, as YYYY-MM-DD. */
    date: string;
}

/** The current leaderboard's meta line, mirroring the one each archived edition carries. */
export function ArchiveLink({ date }: ArchiveLinkProps) {
    const textCn = useTextStyles();

    return (
        <p className={cn(styles.archiveLink, textCn('rs-text-1', { hardness: 'hard' }))} data-testid="bench-archive-link">
            <span data-testid="bench-updated">Last updated {formatBenchDate(date)}</span>
            <span className={styles.separator} aria-hidden="true">
                ·
            </span>
            <a href={ARCHIVE_URL} className={textCn('rs-link', { external: false })} data-testid="bench-archive-cta">
                Archived leaderboards
            </a>
        </p>
    );
}
