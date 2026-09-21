import methodologyRaw from '../../../../data/benchmark/methodology.yml';

/**
 * A single dataset repository row.
 */
export interface DatasetRepository {
    name: string;
    url: string;
    tasks: number;
}

const rawRepositories: DatasetRepository[] =
    (methodologyRaw as { repositories?: DatasetRepository[] }).repositories ?? [];

export const repositories: DatasetRepository[] = rawRepositories;

/** Dataset totals, derived so the prose cannot drift from methodology.yml. */
export const repositoryCount: number = repositories.length;

export const totalTasks: number = repositories.reduce((sum, repository) => sum + repository.tasks, 0);

const NUMBER_WORDS = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
] as const;

/** Small counts read better spelled out in prose; larger ones fall back to digits. */
export const spellOut = (value: number): string => NUMBER_WORDS[value] ?? String(value);

export const repositoryCountWord: string = spellOut(repositoryCount);
