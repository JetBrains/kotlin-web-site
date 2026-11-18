import React, { ComponentType } from 'react';

import { MethodologyHero } from '../hero';
import { MethodologyContentV1 } from '../content/v1';
import { MethodologyContentV2 } from '../content/v2';
import { findMethodology, latestMethodology, methodologyTitle } from '../versions';
import { BenchmarkLayout } from '../../layout';
import { METHODOLOGY_TITLE, METHODOLOGY_URL } from '../../constants';

const CONTENT: Record<number, ComponentType> = {
    1: MethodologyContentV1,
    2: MethodologyContentV2,
};

interface MethodologyPageProps {
    version: number;
}

export function MethodologyPage({ version }: MethodologyPageProps) {
    const methodology = findMethodology(version);
    const Content = CONTENT[version];

    if (!methodology) {
        throw new Error(
            `Benchmark methodology ${version} is not published: register it in blocks/benchmark/methodology/versions.ts.`
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
            description={methodology.summary}
            currentUrl={METHODOLOGY_URL}
            activeTopMenuUrl={METHODOLOGY_URL}
        >
            <MethodologyHero methodology={methodology} />
            <Content />
        </BenchmarkLayout>
    );
}
