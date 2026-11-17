import React, { useMemo } from 'react';

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
        label: 'Resolution rate (%)',
        hint: 'Percentage of tasks that were resolved',
        format: twoDecimals,
        emphasis: true,
    },
    {
        key: 'cost',
        label: 'Avg. cost / task ($)',
        hint: 'Average cost of a single task in USD',
        format: twoDecimals,
    },
    {
        key: 'tokens',
        label: 'Avg. tokens / task (M)',
        hint: 'Average token consumption for a single task',
        format: twoDecimals,
    },
    {
        key: 'latency',
        label: 'Avg. latency / task (min)',
        hint: 'Average time to solve a single task, in minutes',
        format: (value) => `${value}m`,
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

    return (
        <>
            <TaskGroupSwitcher group={taskGroup} counts={edition.tasks} onChange={onTaskGroupChange} />
            <BenchmarkTable columns={COLUMNS} rows={rows} />
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
