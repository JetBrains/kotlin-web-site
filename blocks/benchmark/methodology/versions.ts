import { METHODOLOGY_URL } from '../constants';
import { V1_TOTAL_TASKS } from './content/v1-dataset';

export interface MethodologyVersion {
    version: number;
    label: string;
    summary: string;
}


export const methodologyVersions: MethodologyVersion[] = [
    {
        version: 1,
        label: '1.0',
        summary: `See how the Kotlin Benchmark is built: ${V1_TOTAL_TASKS} tasks from eight open-source Kotlin repositories, SWE-bench-based methodology, and future plans.`,
    },
    {
        version: 2,
        label: '2.0',
        summary:
            'See how the Kotlin Benchmark 2.0 is built: the evaluation design, reward-hacking prevention, and future plans.',
    },
].sort((a, b) => b.version - a.version);

export const latestMethodology: MethodologyVersion = methodologyVersions[0];

export const findMethodology = (version: number): MethodologyVersion | undefined =>
    methodologyVersions.find((methodology) => methodology.version === version);

export const methodologyUrl = (version: number): string =>
    version === latestMethodology.version ? METHODOLOGY_URL : `${METHODOLOGY_URL}${version}/`;

export const methodologyTitle = (methodology: MethodologyVersion): string => `Methodology ${methodology.label}`;
