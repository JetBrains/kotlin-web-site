import React, { ReactNode } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';
import { HorizontalBarchart } from '@webteam/horizontal-barchart';
import { PieChart } from '@webteam/pie-chart';

import styles from './content.module.css';
import { KOTLIN_BENCHMARK_URL } from '@/blocks/benchmark/constants';

interface Reference {
    text: string;
    url: string;
}

const REFERENCES: Reference[] = [
    { text: 'JetBrains. (2026). Kotlin benchmarks. Kotlin.', url: 'https://kotlinlang.org/benchmark/' },
    {
        text: 'Cursor. (2026). Reward hacking coding benchmarks.',
        url: 'https://cursor.com/blog/reward-hacking-coding-benchmarks',
    },
    { text: 'Claude Platform Docs. Effort.', url: 'https://platform.claude.com/docs/en/build-with-claude/effort' },
    {
        text: 'OpenAI Developers. Reasoning models.',
        url: 'https://developers.openai.com/api/docs/guides/reasoning?api-mode=responses',
    },
    { text: 'Kimi. Reasoning effort.', url: 'https://platform.kimi.ai/docs/guide/use-reasoning-effort' },
    { text: 'Gemini API Documentation. Gemini Thinking.', url: 'https://aistudio.google.com/docs/thinking' },
];

const refId = (n: number) => `methodology-ref-${n}`;

/** Footnote marker */
function Ref({ n, to }: { n: number; to?: number }) {
    return (
        <a className={styles.ref} href={`#${refId(n)}`} data-testid="methodology-ref">
            {to ? `${n}–${to}` : n}
        </a>
    );
}

const CHART_POSTFIX = ' tasks';

const SOURCE_CHART_MODEL = {
    entries: [
        { title: 'Open source - 70 tasks', value: '70' },
        { title: 'Close source - 30 tasks *', value: '30' }
    ],
};

const CATEGORY_CHART_MODEL = {
    entries: [
        { title: 'Android', value: 30 },
        { title: 'Backend', value: 20 },
        { title: 'Libraries and tools', value: 10 },
        { title: 'Kotlin Multiplatform', value: 10 },
    ],
};

const CHART_HIGHLIGHT = [0];

function Chart({ title, testId, children }: { title: string; testId: string; children: ReactNode }) {
    const textCn = useTextStyles();

    return (
        <div className={styles.chart} data-testid={testId}>
            <h4 className={cn(styles.chartTitle, textCn('rs-h5'))}>{title}</h4>
            {children}
        </div>
    );
}

function Section({ title, children }: { title?: string; children: ReactNode }) {
    const textCn = useTextStyles();

    return (
        <section className={styles.section}>
            {title && <h2 className={cn(styles.heading, textCn('rs-h2'))}>{title}</h2>}
            {children}
        </section>
    );
}

export function MethodologyContentV2() {
    const textCn = useTextStyles();
    const text = cn(styles.text, textCn('rs-text-2'));
    const list = cn(styles.list, textCn('rs-text-2'));

    return (
        <div className={cn(styles.content, 'ktl-layout', 'ktl-layout--center')} data-testid="methodology-content">
            <div className={styles.inner}>
                <Section>
                    <p className={text}>
                        We’re introducing Kotlin Benchmark 2.0, a new benchmark built on a redesigned evaluation
                        methodology and an entirely new dataset. Compared to the previous Kotlin Benchmark,
                        <Ref n={1} /> this release:
                    </p>
                    <ul className={list}>
                        <li>Provides broader coverage of the Kotlin ecosystem.</li>
                        <li>Introduces more challenging tasks.</li>
                        <li>
                            Includes both open- and closed-source tasks for a more comprehensive and robust evaluation
                            of coding agents.
                        </li>
                        <li>
                            Restricts network access to ensure that agents can’t look up solutions online for
                            open-source tasks.
                        </li>
                    </ul>
                    <p className={text}>
                        The goal of this setup is to demonstrate how agents and models perform on complex Kotlin tasks
                        and assess the resources required to complete them.
                    </p>
                </Section>

                <Section title="The dataset">
                    <p className={text}>
                        The dataset consists of 100 Kotlin engineering tasks covering Android, backend/server, Kotlin
                        Multiplatform, and library development, including 70 open-source tasks from 25 GitHub
                        repositories and 30 closed-source tasks from private JetBrains repositories. They range in
                        complexity from medium to hard, consist mainly of bug fixes or refactoring implementations, and
                        require multi-file changes.
                    </p>

                    <div className={styles.chartsCard} data-testid="methodology-dataset-charts">
                        <h3 className={cn(styles.chartsTitle, textCn('rs-h3'))}>
                            Software engineering task distribution
                        </h3>
                        <div className={styles.charts}>
                            <Chart title="Open-source tasks by category" testId="methodology-category-chart">
                                <HorizontalBarchart
                                    model={CATEGORY_CHART_MODEL}
                                    coloredSections={CHART_HIGHLIGHT}
                                    postfix={CHART_POSTFIX}
                                />
                            </Chart>

                            <Chart title="Tasks by source availability (n=100)" testId="methodology-source-chart">
                                <PieChart model={SOURCE_CHART_MODEL} />
                            </Chart>
                        </div>

                        <p className={textCn('rs-text-3')}>* All closed source tasks are backend.</p>
                    </div>
                </Section>

                <Section title="Evaluation design">
                    <p className={text}>
                        We verified all selected tasks for construction and design correctness, ensuring that each
                        task’s container image could be built and that its specification was accurate and sufficient for
                        an agent to implement a solution. We also validated that no task could pass verification without
                        implementing the required changes and passing the test suite.
                    </p>
                    <p className={text}>
                        We evaluated 13 agentic setups, including widely used models and coding harnesses such as Claude
                        Code, OpenAI Codex, and OpenCode. To keep configurations representative of typical usage
                        scenarios, we used the recommended settings for most parameters. Reasoning effort was set to
                        “high” for each setup, with one exception: Kimi, for which the provider’s
                        recommended setting is “max”.
                        <Ref n={5} /> We selected “high” based on provider recommendations, which commonly cite it as a
                        balanced choice for complex coding tasks.
                        <Ref n={3} to={6} /> This effort level gives the agent a sufficient reasoning budget without the
                        cost and latency overhead of maximum effort. However, exact implementations of the effort level
                        and predefined behavior still vary across providers.
                    </p>
                    <p className={text}>
                        Each evaluation is repeated three times to balance result variability and resource consumption.
                        We’ve granted a timeout budget of 30 minutes for each task resolution. After each run, the
                        agent’s changes are evaluated in a separate, isolated verifier container. The verifier executes
                        the task’s test suite and compares the resulting JUnit reports against the expected test
                        outcomes recorded in the dataset. A run is considered successful only if all recorded
                        fail-to-pass tests pass. Before verification, any additional artifacts generated in the agent
                        sandbox are discarded to ensure a clean and consistent testing environment.
                    </p>
                    <p className={text}>
                        We report aggregated results for the full dataset alongside separate breakdowns for the open-
                        and closed-source subsets, as well as resource consumption metrics.
                    </p>
                </Section>

                <Section title="Reward-hacking prevention">
                    <p className={text}>
                        Preliminary runs revealed that open-source tasks were susceptible to reward hacking by agents.
                        To mitigate this risk, following the practices recommended by Cursor,
                        <Ref n={2} /> we configured the execution environment for open-source tasks to run in{' '}
                        <em>no-network</em> mode, allowing network traffic only for environment setup and verifier. All dependencies
                        required for task execution were pre-cached. Additionally, repository history was isolated to
                        limit retrieval of published solutions. To prevent agents from spending effort on network
                        requests that would inevitably fail, we explicitly informed the agents that network access was
                        disabled. In contrast, for closed-source tasks, agents retain network access by default, though
                        repository history remains concealed.
                    </p>
                </Section>

                <Section title="Future outlook">
                    <p className={text}>
                        Our goal is to create a benchmark that serves as a reliable evaluation source for technical
                        decision makers or individual developers who use AI when writing Kotlin code. To achieve this,
                        we have identified the following next steps to further improve the reliability of benchmark
                        insights:
                    </p>
                    <ul className={list}>
                        <li>
                            Integrate non-functional code metrics using{' '}
                            <a
                                className={textCn('rs-link', { external: true })}
                                href="https://www.jetbrains.com/qodana/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Qodana
                            </a>{' '}
                            (e.g., code quality, security vulnerabilities, and potential bug rate).
                        </li>
                        <li>
                            Evaluate agents on long-horizon tasks that better reflect real-world software development
                            lifecycle scenarios.
                        </li>
                        <li>Expand the catalogue of the open-source setups.</li>
                    </ul>
                </Section>

                <Section title="References">
                    <ol className={cn(styles.references, textCn('rs-text-3'))} data-testid="methodology-references">
                        {REFERENCES.map((reference, index) => (
                            <li key={reference.url} id={refId(index + 1)}>
                                {reference.text}{' '}
                                <a
                                    className={textCn('rs-link', { external: true })}
                                    href={reference.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {reference.url}
                                </a>
                            </li>
                        ))}
                    </ol>
                </Section>

                <div className={styles.footer}>
                    <Button size="l" mode="rock" href={KOTLIN_BENCHMARK_URL} data-testid="methodology-benchmark-cta">
                        View the leaderboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
