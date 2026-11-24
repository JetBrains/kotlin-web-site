import React, { useMemo } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import { BenchEditionV2, BenchGroupRow, groupRows, oneDecimals, twoDecimals } from '@/utils/benchmark-leaderboard';

import styles from '../leaderboard.module.css';
import { BenchmarkTable } from './benchmark-table';
import { TaskGroupSwitcher } from './task-group-switcher';
import { useTaskGroup } from './use-task-group';
import {
    SETUP_COLUMN_LABEL_V2,
    BenchColumn
} from '../leaderboard-data';

const COLUMNS: BenchColumn<BenchGroupRow>[] = [
    {
        key: 'resolutionRate',
        label: 'Resolution rate',
        sublabel: '% of tasks',
        hint: 'Percentage of tasks that were resolved',
        format: oneDecimals,
        emphasis: true,
    },
    {
        key: 'cost',
        label: 'Avg. cost',
        sublabel: '$ per task',
        hint: 'Average cost of a single task in USD',
        format: twoDecimals,
    },
    {
        key: 'tokens',
        label: 'Avg. tokens',
        sublabel: 'M per task',
        hint: 'Average token consumption for a single task',
        format: twoDecimals,
    },
    {
        key: 'latency',
        label: 'Avg. latency',
        sublabel: 'min per task',
        hint: 'Average time to solve a single task, in minutes',
        format: oneDecimals,
    },
    {
        key: 'steps',
        label: 'Avg. steps',
        sublabel: 'per task',
        hint: 'Average number of agent steps for a single task',
    },
];

export interface LeaderboardV2Props {
    edition: BenchEditionV2;
}

export function LeaderboardV2({ edition }: LeaderboardV2Props) {
    const [taskGroup, setTaskGroup] = useTaskGroup();
    const rows = useMemo(() => groupRows(edition, taskGroup), [edition, taskGroup]);
    const textCn = useTextStyles();

    return (
        <>
            <TaskGroupSwitcher group={taskGroup} counts={edition.tasks} onChange={setTaskGroup} />
            <BenchmarkTable columns={COLUMNS} rows={rows} setupLabel={SETUP_COLUMN_LABEL_V2} />
            <p className={cn(styles.footnote, textCn('rs-text-3'))} data-testid="bench-table-note">
                * Each configuration was executed with the time budget of 30 minutes per task.
            </p>
        </>
    );
}
