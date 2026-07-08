import React from 'react';

import { LandingLayout } from '../../components/landing-layout/landing-layout';

import { BenchHero } from '@/blocks/benchmark/hero';
import { Leaderboard } from '@/blocks/benchmark/leaderboard';
import { BenchCta } from '@/blocks/benchmark/cta';
import { KOTLIN_BENCHMARK_TITLE, KOTLIN_BENCHMARK_URL, METHODOLOGY_URL } from '@/blocks/benchmark/constants';

import styles from './index.module.css';

export const GITHUB_URL = 'https://github.com/Kotlin/kotlin-swe-bench' as const;

export default function KotlinBenchmarkLanding() {
    return (
        <LandingLayout
            dataTestId={'benchmark-landing'}
            title={'The Kotlin Benchmark by JetBrains'}
            description={
                'The official JetBrains benchmark for evaluating AI coding agents on real Kotlin software engineering tasks. Explore the leaderboard, dataset, and methodology.'
            }
            ogImageName={'benchmark.jpg'}
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
