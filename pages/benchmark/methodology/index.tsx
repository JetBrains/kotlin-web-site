import React from 'react';

import { LandingLayout } from '@/components/landing-layout/landing-layout';

import { MethodologyHero } from '@/blocks/benchmark/methodology/hero';
import { MethodologyContent } from '@/blocks/benchmark/methodology/content';

import styles from './index.module.css';
import {Button} from '@rescui/button';
import { GitHubIcon } from '@rescui/icons';

const KOTLIN_BENCHMARK_TITLE = 'Kotlin Benchmark' as const;
const KOTLIN_BENCHMARK_URL = '/benchmark/' as const;
const METHODOLOGY_URL = '/benchmark/methodology/' as const;
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
