import React from 'react';

import { BenchmarkLayout } from '@/blocks/benchmark/layout';
import { BenchHero } from '@/blocks/benchmark/hero';
import { Leaderboard } from '@/blocks/benchmark/leaderboard';
import { currentEdition } from '@/blocks/benchmark/leaderboard/leaderboard-data';
import { ArchiveLink } from '@/blocks/benchmark/archive-link';
import { BenchCta } from '@/blocks/benchmark/cta';
import { GITHUB_URL, KOTLIN_BENCHMARK_URL, METHODOLOGY_URL } from '@/blocks/benchmark/constants';

export default function KotlinBenchmarkLanding() {
    return (
        <BenchmarkLayout
            dataTestId={'benchmark-landing'}
            title={'The Kotlin Benchmark by JetBrains'}
            description={
                'The official JetBrains benchmark for evaluating AI coding agents on real Kotlin software engineering tasks. Explore the leaderboard, dataset, and methodology.'
            }
            currentUrl={KOTLIN_BENCHMARK_URL}
        >
            <BenchHero>
                <ArchiveLink date={currentEdition.date} />
            </BenchHero>
            <Leaderboard rows={currentEdition.rows} notice={currentEdition.notice} />
            <BenchCta methodologyUrl={METHODOLOGY_URL} githubUrl={GITHUB_URL} />
        </BenchmarkLayout>
    );
}
