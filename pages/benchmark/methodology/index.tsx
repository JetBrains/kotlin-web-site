import React from 'react';

import { LandingLayout } from '@/components/landing-layout/landing-layout';

import { MethodologyHero } from '@/blocks/benchmark/methodology/hero';
import { MethodologyContent } from '@/blocks/benchmark/methodology/content';
import { KOTLIN_BENCHMARK_TITLE, KOTLIN_BENCHMARK_URL, METHODOLOGY_URL } from '@/blocks/benchmark/constants';

import styles from './index.module.css';
import {Button} from '@rescui/button';
import { GitHubIcon } from '@rescui/icons';

const METHODOLOGY_TITLE = 'Methodology' as const;

const TOP_MENU_ITEMS = [{ url: METHODOLOGY_URL, title: METHODOLOGY_TITLE }];

export default function KotlinBenchmarkMethodology() {
    return (
        <LandingLayout
            dataTestId={'benchmark-methodology'}
            title={'Kotlin Benchmark — Methodology & Outlook'}
            description={
                'How the Kotlin Benchmark is built: the dataset of real Kotlin tasks, the Multi-SWE-bench harness that runs them, and how every result is scored.'
            }
            ogImageName={'benchmark.jpg'}
            currentTitle={KOTLIN_BENCHMARK_TITLE}
            currentUrl={METHODOLOGY_URL}
            topMenuTitle={KOTLIN_BENCHMARK_TITLE}
            topMenuHomeUrl={KOTLIN_BENCHMARK_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={
                <Button icon={<GitHubIcon />} href="" target="_blank" rel="noopener">
                    GitHub repo
                </Button>
            }
        >
            <div className={styles.wrapper}>
                <MethodologyHero />
                <MethodologyContent />
            </div>
        </LandingLayout>
    );
}
