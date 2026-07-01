import React from 'react';

import { LandingLayout } from '../../components/landing-layout/landing-layout';

import { BenchHero } from '@/blocks/benchmark/hero';
import { Leaderboard } from '@/blocks/benchmark/leaderboard';
import { BenchCta } from '@/blocks/benchmark/cta';
import { KOTLIN_BENCHMARK_TITLE, KOTLIN_BENCHMARK_URL, METHODOLOGY_URL } from '@/blocks/benchmark/constants';

import styles from './index.module.css';

// TODO: replace with the real Kotlin Benchmark GitHub repository URL.
const GITHUB_URL = 'https://github.com/Kotlin' as const;

export default function KotlinBenchmarkLanding() {
    return (
        <LandingLayout
            dataTestId={'benchmark-landing'}
            title={'Kotlin Benchmark – Coding Agent Performance Leaderboard'}
            description={
                'Kotlin Benchmark measures coding agent performance on idiomatic Kotlin tasks — an independent source for Kotlin AI quality to help you pick the right tool.'
            }
            // TODO: add the DSGN open-graph asset (2560×1440) at
            // /assets/images/open-graph/benchmark.png and set ogImageName.
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
