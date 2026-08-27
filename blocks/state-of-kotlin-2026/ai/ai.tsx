import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Tag, presets } from '@rescui/tag';
import { HorizontalBarchart } from '@webteam/horizontal-barchart';
import { SectionHeading } from '@/blocks/state-of-kotlin-2026/_shared/section-heading/section-heading';
import { StatCard } from '@/blocks/state-of-kotlin-2026/_shared/stat-card/stat-card';
import { QuoteCard } from '@/blocks/state-of-kotlin-2026/_shared/quote-card/quote-card';
import { GoDeeperBanner } from '@/blocks/state-of-kotlin-2026/_shared/go-deeper-banner/go-deeper-banner';
import { REPORT_SECTION_URLS } from '@/blocks/state-of-kotlin-2026/constants';
import { KOTLIN_BENCHMARK_URL } from '@/blocks/benchmark/constants';
import { FloatingShape } from '@/blocks/state-of-kotlin-2026/_shared/floating-shape/floating-shape';
import { SHAPES } from '@/blocks/state-of-kotlin-2026/_shared/floating-shape/shapes';
import { BenchmarkLeaderboard } from './leaderboard/leaderboard';

import styles from './ai.module.css';

type Stat = { figure: string; caption: string };
type Quote = { quote: string; author: string };
type Capability = { title: string; description: string; tags: string[] };
type AgentCase = {
    company: string;
    logo: string;
    logoAlt: string;
    logoWidth: number;
    text: string;
    /** The design sets the Worldline statement without quotation marks and without an author. */
    quoted?: boolean;
    author?: string;
    role?: string;
    linkText: string;
    linkHref: string;
};

const ASSISTED_STATS: Stat[] = [
    { figure: '93%', caption: 'use at least one AI coding tool' },
    { figure: '81%', caption: 'already use or are likely to try AI coding agents' },
];

const VERIFIED_LEAD =
    'Only 0.3% ship AI-written code without any validation. Practically everyone reviews, runs, or tests the result. Kotlin makes that check easier: When AI invents a method or misuses a nullable value, the code fails to compile before review even starts.';

const VALIDATION_CHART_TITLE = 'How developers validate AI-generated Kotlin code';

/**
 * The bars are a multi-selection question, so they do not add up to 100%. HorizontalBarchart
 * right-aligns every bar and puts the value and the label to its right, which is the layout
 * the design draws.
 */
const VALIDATION_CHART_MODEL = {
    entries: [
        { title: 'Review the code manually', value: 88 },
        { title: 'Run the code', value: 75 },
        { title: 'Run or write tests', value: 66 },
        { title: 'Check against documentation', value: 21 },
        { title: 'No validation', value: 0.3 },
    ],
};

/** Index into VALIDATION_CHART_MODEL.entries that the design paints in the primary colour. */
const VALIDATION_CHART_HIGHLIGHT = [0];

const VALIDATION_CHART_SOURCE =
    'Source: JetBrains State of Kotlin and AI Survey 2026. The shares in this multi-selection question do not total 100%.';

// NOTE: all three quotes below are attributed to the same person in the source design
// (KTL-4799 design issue, see handover notes).
const VERIFIED_QUOTES: Quote[] = [
    {
        quote: "Kotlin's strict compiler and clear build-time errors give it an edge. The AI can easily understand and fix compilation errors before running the code. I'm comparing it to runtime languages like Python or JavaScript, where tracking down bugs is more complex because they only surface during execution.",
        author: 'Adeeb, Android Developer',
    },
    {
        quote: 'Short term, popular GitHub languages like Python and JS/TS are huge because of the training data. Long term, highly structured languages with strong and meaningful references are going to win because they reduce error. […]',
        author: 'Steve, Engineering Lead',
    },
    {
        quote: 'Strong type system, brief and expressive language (less token to generate/read, easier to review).',
        author: 'Lucas, Engineering Lead',
    },
];

const BENCHMARK_PARAGRAPH =
    'The Kotlin Benchmark runs AI coding agents on real issues from active open-source Kotlin repositories, giving teams a public way to measure agent performance and compare setups. In the first public run, the top agent setup resolved 90 of 105 real Kotlin engineering tasks end to end.';

const LEADERBOARD_TITLE = 'The Kotlin Benchmark Leaderboard';

const BUILD_AI_CAPABILITIES: Capability[] = [
    {
        title: 'Call a model',
        description: 'A Kotlin service calls an LLM API and streams the response',
        tags: ['Official model SDKs', 'Ktor HTTP client', 'Typed request/response'],
    },
    {
        title: 'Build AI features into the application',
        description:
            'LLM-backed endpoints, retrieval (RAG) pipelines, and embeddings inside the frameworks teams already run',
        tags: ['Spring AI', 'Ktor'],
    },
    {
        title: 'Orchestrate agents',
        description:
            'Multi-step agentic workflows with tools, memory, and tracing; agents reach tools and data through MCP',
        tags: ['Koog 1.0', 'Kotlin MCP SDK'],
    },
];

const AGENT_CASES: AgentCase[] = [
    {
        company: 'Mercedes-Benz.io',
        logo: '/images/state-of-kotlin-2026/ai-logo-mercedes-benz.svg',
        logoAlt: 'Mercedes-Benz.io',
        logoWidth: 200,
        text: "Thanks to Kotlin's strong typing and concise syntax, reasoning steps remain explicit and testable, while Koog also provides execution and tracing.",
        author: 'Bruno Ferreira',
        role: 'Mercedes-Benz.io',
        linkText: 'Read the full story',
        linkHref:
            'https://www.mercedes-benz.io/blog/2025-11-14-the-guardrails-your-llm-needs-reliable-agent-based-systems',
    },
    {
        company: 'Worldline',
        logo: '/images/state-of-kotlin-2026/ai-logo-worldline.svg',
        logoAlt: 'Worldline',
        logoWidth: 70,
        text: 'Runs its AI conversational platform for more than 1M monthly active users on Kotlin and Spring Boot – and is consolidating Python services onto the same stack.',
        quoted: false,
        linkText: 'Watch video',
        linkHref: 'https://www.youtube.com/watch?v=3IxDICQTutw',
    },
];

export const Ai: FC = () => {
    const textCn = useTextStyles();

    return (
        <section id="ai" className={styles.wrapper} data-testid="sok-ai">
            <FloatingShape shape={SHAPES.hollowCylinder} className={styles.hollowCylinder} depth={120} drift="a" />
            <FloatingShape shape={SHAPES.triangle} className={styles.triangle} depth={95} drift="c" />

            <SectionHeading
                title="Kotlin and AI: tested in real workflows"
                description="The qualities that make Kotlin strong in production – static typing, null safety, coroutines – pay off twice in the AI era: they make AI services easier to build, and AI-generated code easier to trust. The data below covers both directions."
            />

            <div className={styles.panels}>
                <div className={styles.panel} data-testid="sok-ai-assisted">
                    <div className={styles.assistedHeading}>
                        <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>AI-assisted Kotlin development</h3>
                        <p className={cn(styles.panelLead, textCn('rs-text-1'))}>
                            AI tools are already common in the surveyed group
                        </p>
                    </div>
                    <div className={styles.statGrid}>
                        {ASSISTED_STATS.map((stat, index) => (
                            <StatCard
                                key={index}
                                figure={stat.figure}
                                caption={stat.caption}
                                className={styles.statCard}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.panel} data-testid="sok-ai-verified">
                    <div className={styles.verifiedRow}>
                        <div className={styles.verifiedText}>
                            <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>Verified by developers</h3>
                            <p className={cn(styles.panelLead, textCn('rs-text-1'))}>{VERIFIED_LEAD}</p>
                        </div>
                        <div className={styles.chartCard} data-testid="sok-ai-validation-chart">
                            <h4 className={cn(styles.chartTitle, textCn('rs-h5'))}>{VALIDATION_CHART_TITLE}</h4>
                            <div className={styles.chartCardInner}>
                                <HorizontalBarchart
                                    model={VALIDATION_CHART_MODEL}
                                    coloredSections={VALIDATION_CHART_HIGHLIGHT}
                                />
                            </div>
                            <p className={cn(styles.chartFootnote, textCn('rs-text-3'))}>{VALIDATION_CHART_SOURCE}</p>
                        </div>
                    </div>
                    <div className={styles.quoteGrid}>
                        {VERIFIED_QUOTES.map((quote, index) => (
                            <div className={styles.quoteBox} key={index}>
                                <p className={cn(styles.quoteText, textCn('rs-text-1'))}>&ldquo;{quote.quote}&rdquo;</p>
                                <p className={cn(styles.quoteAuthor, textCn('rs-h3'))}>{quote.author}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.panel} data-testid="sok-ai-benchmark">
                    <div className={styles.benchmarkRow}>
                        <div className={styles.benchmarkText}>
                            <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>
                                Measured in the open: the Kotlin Benchmark
                            </h3>
                            <p className={cn(styles.panelLead, textCn('rs-text-1'))}>{BENCHMARK_PARAGRAPH}</p>
                        </div>
                        <StatCard
                            figure="86%"
                            caption="of real Kotlin tasks resolved by the top agent"
                            className={styles.statCard}
                        />
                    </div>

                    <div className={styles.leaderboardGroup}>
                        <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>{LEADERBOARD_TITLE}</h3>
                        <div className={styles.leaderboard}>
                            <BenchmarkLeaderboard />
                        </div>
                    </div>

                    {/*
                     * A single-line link, so it uses the rescui link – `external` supplies the ↗.
                     * rs-link inherits its font metrics, so the text style goes on the wrapper.
                     */}
                    <div className={cn(styles.benchmarkLink, textCn('rs-text-1'))}>
                        <a href={KOTLIN_BENCHMARK_URL} className={textCn('rs-link', { external: true })}>
                            Compare AI agents on the Kotlin Benchmark
                        </a>
                    </div>
                </div>

                <div className={styles.panel} data-testid="sok-ai-build">
                    <div className={styles.buildAiHeading}>
                        <h3 className={cn(styles.panelTitle, textCn('rs-h3'))}>Build AI in Kotlin</h3>
                        <p className={cn(styles.panelLead, textCn('rs-text-1'))}>
                            Production AI needs to be reliable, observable, and easy to operate. Kotlin lets teams build
                            AI services using the same language, frameworks, and deployment pipeline they already use
                            without standing up a separate Python stack.
                        </p>
                    </div>
                    {/* the design staggers the three cards, all of them flush with the row's bottom edge */}
                    <div className={styles.capabilityGrid}>
                        {BUILD_AI_CAPABILITIES.map((capability, index) => (
                            <div className={styles.capabilityColumn} key={index}>
                                <div className={styles.capabilityCard} data-testid={`sok-ai-capability-${index}`}>
                                    {/* the card pushes the tags to its bottom edge, so the copy needs a wrapper */}
                                    <div>
                                        <h4 className={cn(styles.capabilityTitle, textCn('rs-h3'))}>
                                            {capability.title}
                                        </h4>
                                        <p className={cn(styles.capabilityText, textCn('rs-text-1'))}>
                                            {capability.description}
                                        </p>
                                    </div>
                                    <div className={styles.capabilityTags}>
                                        {capability.tags.map((tag) => (
                                            <Tag key={tag} size="l" {...presets['outline-light']}>
                                                {tag}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.panel} data-testid="sok-ai-agents">
                    <h3 className={cn(styles.panelTitle, styles.agentsTitle, textCn('rs-h3'))}>Agents in Production</h3>
                    <div className={styles.caseRow}>
                        {AGENT_CASES.map((agentCase, index) => (
                            <QuoteCard
                                key={index}
                                logoSrc={agentCase.logo}
                                logoAlt={agentCase.logoAlt}
                                logoWidth={agentCase.logoWidth}
                                company={agentCase.company}
                                quote={agentCase.text}
                                quoted={agentCase.quoted}
                                author={agentCase.author}
                                role={agentCase.role}
                                linkText={agentCase.linkText}
                                linkHref={agentCase.linkHref}
                                className={styles.caseCard}
                                testId={`sok-ai-case-${index}`}
                            />
                        ))}
                    </div>
                </div>

                <GoDeeperBanner text="Go deeper: Kotlin + AI" href={REPORT_SECTION_URLS.ai} testId="sok-ai-cta" />
            </div>
        </section>
    );
};
