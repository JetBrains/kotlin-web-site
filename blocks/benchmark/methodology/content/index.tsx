import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';
import styles from './content.module.css';
import { repositories } from './dataset-data';
import { KOTLIN_BENCHMARK_URL } from '@/blocks/benchmark/constants';

const MULTI_SWE_BENCH_URL = 'https://github.com/multi-swe-bench' as const;

interface FutureItem {
    title: string;
    text: string;
}

const FUTURE_ITEMS: FutureItem[] = [
    {
        title: 'Dataset',
        text: `We’re moving toward a data split that is more representative of the Kotlin ecosystem.
         Our current work focuses on expanding the task set into common Kotlin domains, such as Android and KMP,
          and introducing a range of difficulty levels so the benchmark better reflects real-world use cases.`,
    },
    {
        title: 'Set of metrics',
        text: `Today, task verification uses tests as the primary correctness gate.
         In upcoming iterations, we’ll add non-functional dimensions, such as cost, token consumption, code quality,
          runtime performance, maintainability, and security. This will help you evaluate the best cost/intelligence
           trade-offs for your domain.`,
    },
    {
        title: 'Model coverage',
        text: 'We plan to broaden the catalog of evaluated models to include more open-weight and open-source solutions.',
    },
];

export function MethodologyContent() {
    const textCn = useTextStyles();

    return (
        <div className={cn(styles.content, 'ktl-layout', 'ktl-layout--center')} data-testid="methodology-content">
            <div className={styles.inner}>
                <section className={styles.section}>
                    <h2 className={cn(styles.heading, textCn('rs-h2'))}>What we built</h2>
                    <p className={cn(styles.text, textCn('rs-text-2'))}>
                        The Kotlin Benchmark is based on the open-source{' '}
                        <a
                            className={textCn('rs-link', { external: true })}
                            href={MULTI_SWE_BENCH_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="methodology-msb-link"
                        >
                            Multi-SWE-bench
                        </a>{' '}
                        harness. We extend Multi-SWE-bench, which already supports Java, Go, TypeScript, Rust, and other
                        languages, with{' '}
                        <span className={cn(styles.span, textCn('rs-text-2', { hardness: 'hard' }))}>
                            first-class Kotlin support
                        </span>
                        :{' '}
                    </p>
                    <ul className={cn(styles.span, textCn('rs-text-2'))}>
                        <li>
                            The ability to build repository harnesses across libraries (ktlint, detekt, okhttp, and
                            dataframe).
                        </li>
                        <li>JVM tooling and IDE plugins (ORT, TeXiFy-IDEA, Gradle Shadow).</li>
                        <li>Android applications.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={cn(styles.heading, textCn('rs-h2'))}>The Dataset</h2>
                    <p className={cn(styles.text, textCn('rs-text-2'))}>
                        The Kotlin Benchmark{' '}
                        <span className={cn(styles.span, textCn('rs-text-2', { hardness: 'hard' }))}>
                            contains 105&nbsp;tasks across eight&nbsp;repositories
                        </span>
                        , drawn from open production Kotlin codebases. We selected repositories based on popularity
                        (number of stars) and contributor activity. Each task is a real, merged GitHub pull request that
                        implements a fix. The model is given the issue or PR description and must produce a patch that
                        passes a hidden regression test.
                    </p>

                    <div className={styles.tableCard}>
                        <table className={styles.table} data-testid="methodology-dataset-table">
                            <thead>
                                <tr>
                                    <th
                                        className={cn(styles.th, textCn('rs-text-2', { hardness: 'hard' }))}
                                        scope="col"
                                    >
                                        Repository
                                    </th>
                                    <th
                                        className={cn(
                                            styles.th,
                                            styles.thNum,
                                            textCn('rs-text-2', { hardness: 'hard' })
                                        )}
                                        scope="col"
                                    >
                                        Tasks
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {repositories.map((repo) => (
                                    <tr key={repo.name} className={styles.row} data-testid="methodology-dataset-row">
                                        <td className={cn(styles.td, textCn('rs-text-2', { hardness: 'hard' }))}>
                                            <a
                                                className={textCn('rs-link', { external: true })}
                                                href={repo.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {repo.name}
                                            </a>
                                        </td>
                                        <td
                                            className={cn(
                                                styles.td,
                                                styles.tdNum,
                                                textCn('rs-text-2', { hardness: 'hard' })
                                            )}
                                            data-testid="methodology-dataset-tasks"
                                        >
                                            {repo.tasks}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={cn(styles.heading, textCn('rs-h2'))}>Methodology</h2>
                    <p className={cn(styles.text, textCn('rs-text-2'))}>
                        Based on the Multi-SWE-bench infrastructure, the benchmark is adapted for Kotlin projects. Each
                        task is mined from a merged pull request in a real Kotlin repository. For every task, we capture
                        the base commit, the human-written “gold” solution, the regression tests that define the
                        expected behavior, and the natural-language issue description. Every task builds a reproducible
                        Docker image with a layered-cache strategy, making repeated runs faster while keeping evaluation
                        deterministic. The agent receives the issue and repository state and must produce a patch that
                        completes the task. A task is counted as resolved only when the generated solution passes the
                        required tests.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={cn(styles.heading, textCn('rs-h2'))}>Future outlook</h2>
                    <p className={cn(styles.text, textCn('rs-text-2'))}>
                        We treat benchmarks as a continuous quality measurement pipeline. To improve coverage and
                        usefulness, we’re already working on three areas:
                    </p>
                    <div className={styles.cards}>
                        {FUTURE_ITEMS.map((item) => (
                            <div key={item.title} className={styles.card} data-testid="methodology-future-card">
                                <h3 className={cn(styles.cardTitle, textCn('rs-h3'))}>{item.title}</h3>
                                <p className={cn(styles.cardText, textCn('rs-text-2'))}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className={styles.footer}>
                    <Button size="l" mode="rock" href={KOTLIN_BENCHMARK_URL} data-testid="methodology-benchmark-cta">
                        View the leaderboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
