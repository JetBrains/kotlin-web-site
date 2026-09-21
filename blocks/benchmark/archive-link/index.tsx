import React from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { useTextStyles } from '@rescui/typography';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';
import styles from './archive-link.module.css';
import { formatDate } from '../leaderboard/leaderboard-data';
import { ARCHIVE_URL } from '../constants';

interface ArchiveLinkProps {
    /** Publication date of the leaderboard above, as YYYY-MM-DD. */
    date: string;
}

export function ArchiveLink({ date }: ArchiveLinkProps) {
    const textCn = useTextStyles();
    const size = useMS() ? 'm' : 'l';

    return (
        <section className={cn(styles.archiveLink, 'ktl-layout', 'ktl-layout--center')} data-testid="bench-archive-link">
            <p className={cn(styles.date, textCn('rs-text-2', { hardness: 'hard' }))} data-testid="bench-updated">
                Last updated: {formatDate(date)}
            </p>
            <Button mode="outline" size={size} href={ARCHIVE_URL} data-testid="bench-archive-cta">
                View archived leaderboard
            </Button>
        </section>
    );
}
