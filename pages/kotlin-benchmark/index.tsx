import React from 'react';

import { LandingLayout } from '../../components/landing-layout/landing-layout';

import { BenchHero } from '@/blocks/kotlin-benchmark/hero';
import { Leaderboard } from '@/blocks/kotlin-benchmark/leaderboard';
import { BenchCta } from '@/blocks/kotlin-benchmark/cta';

import styles from './index.module.css';

const KOTLIN_BENCHMARK_TITLE = 'Kotlin Benchmark' as const;
const KOTLIN_BENCHMARK_URL = '/kotlin-benchmark/' as const;

const METHODOLOGY_URL = '/kotlin-benchmark/methodology/' as const;
// TODO: replace with the real Kotlin Benchmark GitHub repository URL.
const GITHUB_URL = 'https://github.com/Kotlin' as const;

export default function KotlinBenchmarkLanding() {
    return (
        <LandingLayout
            dataTestId={'kotlin-benchmark-landing'}
            title={'Kotlin Benchmark – Coding Agent Performance Leaderboard'}
            description={
                'Kotlin Benchmark measures coding agent performance on idiomatic Kotlin tasks — an independent source for Kotlin AI quality to help you pick the right tool.'
            }
            // TODO: add the DSGN open-graph asset (2560×1440) at
            // /assets/images/open-graph/kotlin-benchmark.png and set ogImageName.
            currentTitle={KOTLIN_BENCHMARK_TITLE}
            currentUrl={KOTLIN_BENCHMARK_URL}
            hideTopMenu
        >
            <div className={styles.wrapper}>
                <BenchHero />
                <Leaderboard />
                <BenchCta methodologyUrl={METHODOLOGY_URL} githubUrl={GITHUB_URL} />
            </div>
        </LandingLayout>
    );
}
