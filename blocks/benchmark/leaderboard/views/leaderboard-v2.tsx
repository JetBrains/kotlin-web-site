import React, { useMemo } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from '../leaderboard.module.css';
import { BenchmarkTable } from './benchmark-table';
import { TaskGroupSwitcher } from './task-group-switcher';
import { useTaskGroup } from './use-task-group';
import {
    BenchColumn,
    BenchEditionV2,
    BenchGroupRow,
    BenchTaskGroup,
    groupRows,
    twoDecimals,
} from '../leaderboard-data';

const COLUMNS: BenchColumn<BenchGroupRow>[] = [
    {
        key: 'resolutionRate',
        label: 'Resolution rate',
        sublabel: '% of tasks',
        hint: 'Percentage of tasks that were resolved',
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
    taskGroup?: BenchTaskGroup;
    onTaskGroupChange?: (group: BenchTaskGroup) => void;
}

function LeaderboardV2View({
    edition,
    taskGroup,
    onTaskGroupChange,
}: Required<Pick<LeaderboardV2Props, 'taskGroup' | 'onTaskGroupChange'>> & { edition: BenchEditionV2 }) {
    const rows = useMemo(() => groupRows(edition, taskGroup), [edition, taskGroup]);
    const textCn = useTextStyles();

    return (
        <>
            <TaskGroupSwitcher group={taskGroup} counts={edition.tasks} onChange={onTaskGroupChange} />
            <BenchmarkTable columns={COLUMNS} rows={rows} />
            <p className={cn(styles.footnote, textCn('rs-text-3'))} data-testid="bench-table-note">
                * Each configuration was executed with the time budget of 30 minutes per task.
            </p>
        </>
    );
}

function UncontrolledLeaderboardV2({ edition }: { edition: BenchEditionV2 }) {
    const [taskGroup, setTaskGroup] = useTaskGroup();
    return <LeaderboardV2View edition={edition} taskGroup={taskGroup} onTaskGroupChange={setTaskGroup} />;
}

export function LeaderboardV2({ edition, taskGroup, onTaskGroupChange }: LeaderboardV2Props) {
    if (taskGroup !== undefined && onTaskGroupChange) {
        return <LeaderboardV2View edition={edition} taskGroup={taskGroup} onTaskGroupChange={onTaskGroupChange} />;
    }
    return <UncontrolledLeaderboardV2 edition={edition} />;
}
