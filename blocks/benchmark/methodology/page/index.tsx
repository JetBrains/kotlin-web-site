import React, { ComponentType } from 'react';
import { Button } from '@rescui/button';
import { GitHubIcon } from '@rescui/icons';

import { LandingLayout } from '@/components/landing-layout/landing-layout';
import { GITHUB_URL } from '@/pages/benchmark';

import styles from './page.module.css';
import { MethodologyHero } from '../hero';
import { MethodologyContent } from '../content';
import { findMethodology, latestMethodology, MethodologyVersion, methodologyTitle } from '../versions';
import {
    BENCHMARK_TOP_MENU_ITEMS,
    KOTLIN_BENCHMARK_TITLE,
    KOTLIN_BENCHMARK_URL,
    METHODOLOGY_TITLE,
    METHODOLOGY_URL,
} from '../../constants';

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
        <LandingLayout
            dataTestId={'benchmark-methodology'}
            title={`The Kotlin Benchmark — ${isLatest ? METHODOLOGY_TITLE : methodologyTitle(methodology)} and Outlook`}
            description={`See how the Kotlin Benchmark is built: ${methodology.totalTasks} tasks from ${methodology.repositoryCountWord} open-source Kotlin repositories, SWE-bench-based methodology, and future plans.`}
            ogImageName={'benchmark.jpg'}
            currentTitle={KOTLIN_BENCHMARK_TITLE}
            currentUrl={METHODOLOGY_URL}
            activeTopMenuUrl={METHODOLOGY_URL}
            topMenuTitle={KOTLIN_BENCHMARK_TITLE}
            topMenuHomeUrl={KOTLIN_BENCHMARK_URL}
            topMenuItems={BENCHMARK_TOP_MENU_ITEMS}
            topMenuButton={
                <Button icon={<GitHubIcon />} href={GITHUB_URL} target="_blank" rel="noopener">
                    GitHub repo
                </Button>
            }
        >
            <div className={styles.wrapper}>
                <MethodologyHero methodology={methodology} />
                <Content methodology={methodology} />
            </div>
        </LandingLayout>
    );
}
