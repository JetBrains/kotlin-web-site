import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import styles from './content.module.css';
import { repositories } from './dataset-data';

const MULTI_SWE_BENCH_URL = 'https://github.com/multi-swe-bench' as const;

interface FutureItem {
    title: string;
    text: string;
}

const FUTURE_ITEMS: FutureItem[] = [
    {
        title: 'Dataset',
        text:
            'We are aiming for a more representative Kotlin ecosystem-matching data split. Our current ' +
            'work focuses on expanding our task set to specific domain areas, such as Android and KMP to ' +
            'reflect Kotlin’s frequent use cases, as well as difficulty levels.',
    },
    {
        title: 'Set of metrics',
        text:
            'Currently, the task verification relies on the tests as a correctness gate. In the next ' +
            'iterations, we will provide non-functional dimensions, such as cost, token consumption, code ' +
            'quality, performance, maintainability or security, so you could evaluate the best ' +
            'cost/intelligence ratio for your domain.',
    },
    {
        title: 'Evaluation of open weight models',
        text: 'We are aiming at expanding the evaluated model catalogue and benchmark open-source solutions.',
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
                        A Kotlin-language software-engineering benchmark built on the open-source{' '}
                        <a
                            className={textCn('rs-link', { external: true })}
                            href={MULTI_SWE_BENCH_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="methodology-msb-link"
                        >
                            Multi-SWE-bench
                        </a>{' '}
                        harness. Multi-SWE-bench shipped with Java/Go/TS/Rust/etc. support — we extended it with
                        first-class Kotlin support, building repository harnesses across Kotlin libraries (ktlint,
                        detekt, okhttp, dataframe), JVM tooling and IDE plugins (ORT, TeXiFy-IDEA, Gradle Shadow), and
                        Android applications.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={cn(styles.heading, textCn('rs-h2'))}>The Dataset</h2>
                    <p className={cn(styles.text, textCn('rs-text-2'))}>
                        The released Kotlin SWE-based Benchmark contains 105 tasks across 8 repositories, drawn from
                        open production Kotlin codebases. We have selected repositories based on popularity (amount of
                        stars) and contributor’s activity. Each task is a real, merged GitHub pull request that
                        implements a task; the model is given the issue/PR description and must produce a patch that
                        makes a hidden regression test pass.
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
                                            className={cn(styles.td, styles.tdNum, textCn('rs-text-2', { hardness: 'hard' }))}
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
                        Each task is mined from a merged PR and captures the base commit, the human-written (gold)
                        solution, the regression tests, and the natural-language issue description shown to the model.
                    </p>
                    <p className={cn(styles.text, textCn('rs-text-2'))}>
                        Every task builds a Docker image using a layered-cache strategy, so re-runs are fast and
                        deterministic. A task is resolved only if the test verification fully passes.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={cn(styles.heading, textCn('rs-h2'))}>Future outlook</h2>
                    <p className={cn(styles.text, textCn('rs-text-2'))}>
                        We treat benchmarks as a continuous quality measurement pipeline. That is why we are already
                        working towards improvements:
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
            </div>
        </div>
    );
}
