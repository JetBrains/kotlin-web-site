import methodologyV1Raw from '../../../data/benchmark/methodology/1.yml';
import methodologyV2Raw from '../../../data/benchmark/methodology/2.yml';
import { METHODOLOGY_URL } from '../constants';

/**
 * A single dataset repository row.
 */
export interface DatasetRepository {
    name: string;
    url: string;
    tasks: number;
}

/**
 * One published methodology. The latest lives at /benchmark/methodology/,
 * older ones at /benchmark/methodology/<version>/.
 */
export interface MethodologyVersion {
    version: number;
    /** Human-readable version, e.g. "1.0". */
    label: string;
    repositories: DatasetRepository[];
    /** Dataset totals, derived so the prose cannot drift from the yml. */
    repositoryCount: number;
    totalTasks: number;
    repositoryCountWord: string;
}

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

const toMethodology = (raw: unknown): MethodologyVersion => {
    const { version, label, repositories = [] } = raw as {
        version: number;
        label: string;
        repositories?: DatasetRepository[];
    };

    return {
        version: Number(version),
        label: String(label),
        repositories,
        repositoryCount: repositories.length,
        totalTasks: repositories.reduce((sum, repository) => sum + repository.tasks, 0),
        repositoryCountWord: spellOut(repositories.length),
    };
};

/** Every published methodology, newest first. Register a new data/benchmark/methodology/<N>.yml here. */
export const methodologyVersions: MethodologyVersion[] = [
    toMethodology(methodologyV1Raw),
    toMethodology(methodologyV2Raw),
].sort((a, b) => b.version - a.version);

export const latestMethodology: MethodologyVersion = methodologyVersions[0];

export const findMethodology = (version: number): MethodologyVersion | undefined =>
    methodologyVersions.find((methodology) => methodology.version === version);

/** The latest version keeps the unversioned URL, so existing links always show the current methodology. */
export const methodologyUrl = (version: number): string =>
    version === latestMethodology.version ? METHODOLOGY_URL : `${METHODOLOGY_URL}${version}/`;

export const methodologyTitle = (methodology: MethodologyVersion): string => `Methodology ${methodology.label}`;
