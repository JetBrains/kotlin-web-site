import React from 'react';
import cn from 'classnames';

import { BenchEdition, isGroupedEdition } from '@/utils/benchmark-leaderboard';

import styles from './leaderboard.module.css';
import { LeaderboardV1 } from './views/leaderboard-v1';
import { LeaderboardV2 } from './views/leaderboard-v2';

export interface LeaderboardProps {
    edition: BenchEdition;
}

export function Leaderboard({ edition }: LeaderboardProps) {
    return (
        <section className={cn(styles.section, 'ktl-layout', 'ktl-layout--center')} data-testid="bench-leaderboard">
            {isGroupedEdition(edition) ? (
                <LeaderboardV2 edition={edition} />
            ) : (
                <LeaderboardV1 edition={edition} />
            )}
        </section>
    );
}
