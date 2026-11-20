import { useQueryState } from '@/hooks';
import { parseEnum } from '@/utils/queryParser';
import { BENCH_TASK_GROUPS, BenchTaskGroup } from '@/utils/benchmark-leaderboard';

const DEFAULT_TASK_GROUP: BenchTaskGroup = 'all';

const parse = (value: unknown) => parseEnum(value, BENCH_TASK_GROUPS, DEFAULT_TASK_GROUP);
const serialize = (value: BenchTaskGroup) => (value === DEFAULT_TASK_GROUP ? undefined : value);

export const useTaskGroup = () => useQueryState<BenchTaskGroup>('tasks', parse, serialize);
