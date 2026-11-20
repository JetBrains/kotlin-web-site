import React from 'react';
import cn from 'classnames';

import styles from './leaderboard.module.css';
import { BenchEdition, isGroupedEdition } from './leaderboard-data';
import { LeaderboardV1 } from './views/leaderboard-v1';
import { LeaderboardV2, LeaderboardV2Props } from './views/leaderboard-v2';

export interface LeaderboardProps extends Omit<LeaderboardV2Props, 'edition'> {
    edition: BenchEdition;
}

export function Leaderboard({ edition, taskGroup, onTaskGroupChange }: LeaderboardProps) {
    return (
        <section className={cn(styles.section, 'ktl-layout', 'ktl-layout--center')} data-testid="bench-leaderboard">
            {isGroupedEdition(edition) ? (
                <LeaderboardV2 edition={edition} taskGroup={taskGroup} onTaskGroupChange={onTaskGroupChange} />
            ) : (
                <LeaderboardV1 edition={edition} />
            )}
        </section>
    );
}
