import methodologyRaw from '../../../../data/kotlin-benchmark/methodology.yml';

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
