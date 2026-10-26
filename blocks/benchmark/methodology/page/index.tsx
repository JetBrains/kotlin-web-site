import React, { ComponentType } from 'react';

import { MethodologyHero } from '../hero';
import { MethodologyContent } from '../content';
import { findMethodology, latestMethodology, MethodologyVersion, methodologyTitle } from '../versions';
import { BenchmarkLayout } from '../../layout';
import { METHODOLOGY_TITLE, METHODOLOGY_URL } from '../../constants';

/**
 * The prose of each methodology version. Every version registered in ../versions.ts needs an entry here.
 * Versions can share a component until their text diverges; the dataset table always comes from the version's yml.
 */
const CONTENT: Record<number, ComponentType<{ methodology: MethodologyVersion }>> = {
    1: MethodologyContent,
    2: MethodologyContent,
};

interface MethodologyPageProps {
    version: number;
}

export function MethodologyPage({ version }: MethodologyPageProps) {
    const methodology = findMethodology(version);
    const Content = CONTENT[version];

    if (!methodology) {
        throw new Error(
            `Benchmark methodology ${version} has no data: add data/benchmark/methodology/${version}.yml ` +
                `and register it in blocks/benchmark/methodology/versions.ts.`
        );
    }

    if (!Content) {
        throw new Error(
            `Benchmark methodology ${version} has no content component: add \`${version}: <Component>\` ` +
                `to CONTENT in blocks/benchmark/methodology/page/index.tsx.`
        );
    }

    const isLatest = methodology.version === latestMethodology.version;

    return (
        <BenchmarkLayout
            dataTestId={'benchmark-methodology'}
            title={`The Kotlin Benchmark — ${isLatest ? METHODOLOGY_TITLE : methodologyTitle(methodology)} and Outlook`}
            description={`See how the Kotlin Benchmark is built: ${methodology.totalTasks} tasks from ${methodology.repositoryCountWord} open-source Kotlin repositories, SWE-bench-based methodology, and future plans.`}
            currentUrl={METHODOLOGY_URL}
            activeTopMenuUrl={METHODOLOGY_URL}
        >
            <MethodologyHero methodology={methodology} />
            <Content methodology={methodology} />
        </BenchmarkLayout>
    );
}
