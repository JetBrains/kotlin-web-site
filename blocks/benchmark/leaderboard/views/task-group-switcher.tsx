import React, { useMemo } from 'react';
import { Switcher } from '@rescui/switcher';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import { BenchEditionV2, BenchTaskGroup } from '@/utils/benchmark-leaderboard';

import styles from './task-group-switcher.module.css';

const LABELS: Record<BenchTaskGroup, string> = {
    all: 'All tasks',
    open: 'Open-source tasks',
    closed: 'Closed-source tasks',
};

export interface TaskGroupSwitcherProps {
    /** The view the leaderboard currently shows. */
    group: BenchTaskGroup;
    /** Task count of each group, shown next to its label. */
    counts: BenchEditionV2['tasks'];
    onChange: (group: BenchTaskGroup) => void;
}

export function TaskGroupSwitcher({ group, counts, onChange }: TaskGroupSwitcherProps) {
    const size = useMS() ? 's' : 'm';

    const options = useMemo(
        () =>
            (Object.keys(LABELS) as BenchTaskGroup[]).map((value) => ({
                value,
                label: `${LABELS[value]} (${counts[value]})`,
            })),
        [counts]
    );

    return (
        <div className={styles.taskGroupSwitcher} data-testid="bench-task-switcher">
            <Switcher
                mode="rock"
                theme="dark"
                size={size}
                value={group}
                onChange={onChange}
                options={options}
                data-e2e="bench-task-switcher"
            />
        </div>
    );
}
