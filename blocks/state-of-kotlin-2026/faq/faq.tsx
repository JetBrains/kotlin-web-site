import React, { FC } from 'react';
import Head from 'next/head';
import cn from 'classnames';
import { Accordion, Collapse } from '@rescui/collapse';
import { useTextStyles } from '@rescui/typography';

import { REPORT_PDF_URL, REPORT_SECTION_URLS } from '@/blocks/state-of-kotlin-2026/constants';
import { KOTLIN_BENCHMARK_URL } from '@/blocks/benchmark/constants';
import { Markdown } from '@/utils/mdToHtml';

import styles from './faq.module.css';

type FaqItem = { question: string; answer: string };

const FAQ_ITEMS: FaqItem[] = [
    {
        question: 'How many developers use Kotlin?',
        answer: `8.1 million developers worldwide have Kotlin experience (2025). 80% of Kotlin developers use the language in production, 67% have more than two years of experience with it, and 87% are satisfied or very satisfied with the language.

*Source: JetBrains State of Developer Ecosystem Survey 2025; JetBrains Kotlin Developer Survey 2024–2025.*

**Go deeper:** [Kotlin: 15 Years in Numbers](${REPORT_PDF_URL})`,
    },
    {
        question: 'Is Kotlin growing?',
        answer: `Yes – 15 years after its announcement, Kotlin is still growing, and independent rankings confirm the trend JetBrains sees in its own data. Growth now comes from new domains – backend, multiplatform, and AI – on top of Kotlin's established Android base.

* Top-5 fastest-growing language on GitHub (Octoverse, 2024).
* Among the most admired languages (Stack Overflow Developer Survey, 2024).
* #14 in RedMonk language rankings (2025 and 2026).
* Nearly 1 in 5 Kotlin developers started using the language in the 12 months before the 2025 Developer Ecosystem survey.

*Source: GitHub Octoverse 2024; Stack Overflow Developer Survey 2024; RedMonk 2025–2026; JetBrains State of Developer Ecosystem Survey 2025.*

**Go deeper:** [The Kotlin Adoption Curve](${REPORT_SECTION_URLS.growth})`,
    },
    {
        question: 'What has changed in Kotlin over 15 years?',
        answer: `Kotlin has grown into a mature, multi-domain ecosystem. It is the default language for Android, a mainstream JVM backend choice, a stable multiplatform technology, and a language with a production-grade AI stack.

* 2011: JetBrains announces Kotlin.
* 2016: Kotlin 1.0 ships.
* 2017: Google announces official support for Kotlin on Android.
* 2018: JetBrains and Google establish the Kotlin Foundation.
* 2019: Google makes Android development Kotlin-first.
* 2023: Kotlin Multiplatform becomes stable.
* 2024: Kotlin 2.0 ships with the K2 compiler.
* 2025: JetBrains and the Spring team announce a strategic partnership.
* 2026: The Kotlin Benchmark for AI coding agents launches, and the Kotlin standard library gets a formal security and support policy.

*Source: JetBrains and Google public announcements, 2011–2026.*

**Go deeper:** [The Kotlin Adoption Curve](${REPORT_SECTION_URLS.growth})`,
    },
    {
        question: 'Is Kotlin mature enough for enterprise development?',
        answer: `Yes. Kotlin is a 15-year-old language that 80% of its developers run in production, used across software-intensive and regulated industries such as banking and payments (ING, Worldline), with formal long-term commitments behind it.

* About a quarter of Kotlin developers work in companies with 500+ employees.
* Kotlin held the #14 position in RedMonk's language rankings in both 2025 and 2026 – a stable top-15 placement.
* Enterprise readiness strengthened with the 2025 Spring partnership and the 2026 security and support policy for the Kotlin standard library.

*Source: JetBrains State of Developer Ecosystem Survey 2025; JetBrains Kotlin Developer Survey 2025; JetBrains announcements, 2025–2026; RedMonk 2025–2026.*

**Go deeper:** [Enterprise and Organizational Adoption](${REPORT_SECTION_URLS.organizations})`,
    },
    {
        question: 'Which companies use Kotlin in production?',
        answer: `Amazon, ING, Wolt, Kakao Pay, Sony, Duolingo, Booking.com, Mercedes-Benz.io, and Worldline are among the companies that use Kotlin in production and discuss it publicly across backend, mobile, multiplatform, and AI workloads.

* Amazon migrated a 10,000-line backend service from Java to Kotlin.
* ING runs a Kotlin payment engine serving 6M mobile users and 4.5B payments a year.
* Sony built the KMP + Compose Multiplatform companion app for its flagship headphones.
* Worldline runs an AI conversational platform with 1M+ monthly active users on Kotlin and Spring Boot.

*Source: public company case studies and conference talks, 2024–2026.*

**Go deeper:** [Enterprise and Organizational Adoption](${REPORT_SECTION_URLS.organizations})`,
    },
    {
        question: 'Are there enough experienced Kotlin developers?',
        answer: `Yes. The talent pool spans 8.1 million developers with Kotlin experience (2025), and about half of active Kotlin developers have three or more years of experience with the language. Hiring can also draw on the much larger Java pool: 71% of Kotlin developers previously used Java.

*Source: JetBrains Kotlin Developer Survey 2025; JetBrains State of Developer Ecosystem Survey 2025.*

**Go deeper:** [Talent Pool and Workforce Readiness](${REPORT_PDF_URL})`,
    },
    {
        question: 'Is Kotlin Multiplatform production-ready for organizations?',
        answer: `Yes. Kotlin Multiplatform (KMP) has been stable since 2023, Compose Multiplatform for iOS has been stable since 2025, and Google officially endorses KMP for sharing business logic between Android and iOS. Organizations report concrete business outcomes:

* KMP teams build 40–80% of their mobile codebase once and share it across platforms.
* Teams report 15–30% faster release cycles than with separate native codebases.
* Public KMP case studies report ROI within 3–6 months of adoption.
* About 60% of KMP projects share all or almost all of their business logic.
* The ecosystem includes more than 4,000 community KMP libraries.

*Source: JetBrains and Google announcements, 2023–2025; JetBrains Kotlin Multiplatform Survey 2024–2025; public KMP case studies.*

**Go deeper:** [Kotlin Multiplatform – a Strategic Platform Choice](${REPORT_SECTION_URLS.multiplatform})`,
    },
    {
        question: 'How widely is Kotlin Multiplatform adopted?',
        answer: `KMP's share among developers using cross-platform frameworks more than doubled in one year, from 7% (2024) to 18% (2025), and it is gaining ground in the App Store top 10,000 faster than Flutter and React Native.

* KMP's footprint among the top 10,000 iOS apps nearly tripled, from under 1% (early 2024) to almost 3% (mid-2026), outpacing Flutter and React Native.
* By mid-2026, KMP apps in the top 10,000 matched Flutter apps in total App Store revenue, despite being far outnumbered.
* Adopters include Sony, Duolingo, and Booking.com, with hundreds of millions of end users interacting with KMP-powered apps daily.

*Source: Appfigures Intelligence, 2024–2026; JetBrains State of Developer Ecosystem Survey 2024–2025; public KMP case studies.*

**Go deeper:** [Kotlin Multiplatform – a Strategic Platform Choice](${REPORT_SECTION_URLS.multiplatform})`,
    },
    {
        question: 'Is Kotlin good for backend development?',
        answer: `Yes, backend is one of Kotlin's largest domains. 53% of Kotlin developers work on backend projects, running on the same JVM, frameworks, and infrastructure as Java.

* 61% of Kotlin backend developers use Spring / Spring Boot, and 51% use Ktor.
* 89% of the largest engineering organizations (100+ backend developers) already run some Kotlin on the backend.

*Source: JetBrains State of Developer Ecosystem Survey 2025; anonymized JetBrains IDE data, 2026.*

**Go deeper:** [Backend Kotlin: Stability, Productivity, and Enterprise Readiness](${REPORT_SECTION_URLS.backend})`,
    },
    {
        question: 'Is Kotlin a safe long-term choice for JVM backend development?',
        answer: `Yes. Kotlin is developed by JetBrains, governed with Google through the Kotlin Foundation, and now carries the formal commitments enterprises require. Full Java interoperability also protects existing JVM investments – code, libraries, and skills stay usable.

* JetBrains and the Spring team have run a strategic partnership since 2025.
* The Kotlin standard library has had a formal security and support policy since 2026.
* Kotlin is 100% interoperable with Java: Kotlin and Java coexist in the same codebase, so there is no lock-in cliff.

*Source: JetBrains announcements, 2025–2026.*

**Go deeper:** [Backend Kotlin: Stability, Productivity, and Enterprise Readiness](${REPORT_SECTION_URLS.backend})`,
    },
    {
        question: 'Why do Java teams adopt Kotlin?',
        answer: `Java teams adopt Kotlin because it adds measurable productivity to the JVM stack they already run, without a rewrite. Kotlin compiles to the same bytecode and calls existing Java code directly, so adoption usually starts inside an existing Java system, most often during modernization work.

* Development cycles in Kotlin are 15%–20% shorter development cycles than comparable Java tasks.
* 71% of Kotlin backend developers came to Kotlin from Java.
* Kotlin adoption clusters at modernization moments and is 8× higher among projects that migrated from Spring Boot 2 to Spring Boot 3 than among projects that did not.
* The newer the JDK, the likelier the switch: projects on JDK 17 adopt Kotlin about 9× more often than projects on JDK 8, and projects on JDK 21+ about 14× more often.

*Source: JetBrains Research, IDE telemetry of about 320,000 developers and 28M development cycles; JetBrains State of Developer Ecosystem Survey 2025; anonymized JetBrains IDE data, 2026.*

**Go deeper:** [Backend Kotlin: Stability, Productivity, and Enterprise Readiness](${REPORT_SECTION_URLS.backend})`,
    },
    {
        question: 'How can a Java team adopt Kotlin incrementally?',
        answer: `Start with one new service or module. Kotlin and Java are fully interoperable and coexist in the same codebase, so teams adopt Kotlin service by service while the JVM, Spring, build pipelines, and monitoring stay unchanged.

* 70% of new Kotlin backend adopters already had Spring in the project when they added Kotlin.
* A bounded pilot lets a team measure cycle time, build time, review time, and onboarding effort before expanding.
* The full State of Kotlin in 2026 report includes a pilot checklist: what stays the same, what changes, and what to measure.

*Source: anonymized JetBrains IDE data, 2026.*

**Go deeper:** [Backend Kotlin: Stability, Productivity, and Enterprise Readiness](${REPORT_SECTION_URLS.backend})`,
    },
    {
        question: 'Does Kotlin improve developer productivity compared with Java?',
        answer: `Yes, measurably. Development cycles in Kotlin are 15–20% shorter than in comparable Java tasks, based on JetBrains IDE telemetry covering about 320,000 developers and 28 million development cycles. The methodology is described in the full State of Kotlin in 2026 report.

*Source: anonymized JetBrains IDE data, 2026.*

**Go deeper:** [Backend Kotlin: Stability, Productivity, and Enterprise Readiness](${REPORT_SECTION_URLS.backend})`,
    },
    {
        question: 'Is Kotlin well suited to AI-assisted development?',
        answer: `Yes. Kotlin's static typing and null safety catch a common class of AI mistakes at compile time: when a model invents an API or misuses a nullable value, the code fails to compile, and coding agents read those compiler errors to fix their own output before a human reviews the diff. Kotlin's concise syntax also means fewer tokens to generate and less code to review. In JetBrains State of Kotlin and AI Survey 2026, nearly 3 in 4 Kotlin developers said Kotlin is well suited to software development in the age of AI.

*Source: JetBrains State of Kotlin and AI Survey 2026 – 623 active Kotlin users surveyed at and around KotlinConf 2026, an engaged early-adopter audience.*

**Go deeper:** [Kotlin + AI: Tested in Real Workflows](${REPORT_SECTION_URLS.ai})`,
    },
    {
        question: 'Do Kotlin developers use AI coding tools?',
        answer: `Yes. In JetBrains State of Kotlin and AI Survey 2026, 93% of Kotlin developers reported using at least one AI coding tool, and 81% said they already use AI coding agents or are likely to try them.

*Source: JetBrains State of Kotlin and AI Survey 2026 – 623 active Kotlin users surveyed at and around KotlinConf 2026, an engaged early-adopter audience.*

**Go deeper:** [Kotlin + AI: Tested in Real Workflows](${REPORT_SECTION_URLS.ai})`,
    },
    {
        question: 'How accurate is AI-generated Kotlin code?',
        answer: `In JetBrains State of Kotlin and AI Survey 2026, 18% of Kotlin developers said AI-generated Kotlin code is typically correct as-is, and 63% said it needs only minor fixes. Only 0.3% ship AI-generated code without checking it.

*Source: JetBrains State of Kotlin and AI Survey 2026 – 623 active Kotlin users surveyed at and around KotlinConf 2026, an engaged early-adopter audience.*

**Go deeper:** [Kotlin + AI: Tested in Real Workflows](${REPORT_SECTION_URLS.ai})`,
    },
    {
        question: 'How do AI coding agents perform on real Kotlin tasks?',
        answer: `On the Kotlin Benchmark – JetBrains' public benchmark of 105 engineering tasks drawn from open-source Kotlin repositories (July 2026) – the top agent setup resolved 90 of 105 tasks, an 85.7% resolution rate. The dataset, test harness, and leaderboard are public at [kotlinlang.org/benchmark](${KOTLIN_BENCHMARK_URL}), so teams can compare agents on reproducible results instead of vendor claims.

*Source: the Kotlin Benchmark, 2026.*

**Go deeper:** [Kotlin + AI: Tested in Real Workflows](${REPORT_SECTION_URLS.ai})`,
    },
];

const LEFT_COLUMN = FAQ_ITEMS.slice(0, 9);
const RIGHT_COLUMN = FAQ_ITEMS.slice(9);

const stripMarkdown = (value: string) =>
    value
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[*_]/g, '')
        .replace(/^\s*[-*]\s+/gm, '')
        .replace(/\s+/g, ' ')
        .trim();

const FAQ_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [...LEFT_COLUMN, ...RIGHT_COLUMN].map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: stripMarkdown(answer),
        },
    })),
};

export const Faq: FC = () => {
    const textCn = useTextStyles();
    const markdownOptions = {
        overrides: {
            a: {
                props: {
                    className: textCn('rs-link'),
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            },
        },
    };

    return (
        <section id="faq" className={styles.wrapper} data-testid="sok-faq">
            <Head>
                <script
                    type="application/ld+json"
                    key="sok-faq-schema"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
                />
            </Head>
            <h2 className={cn(styles.title, textCn('rs-h1'))} data-testid="sok-faq-title">
                FAQ
            </h2>
            <Accordion>
                <div className={styles.columns}>
                    <div className={styles.column}>
                        {LEFT_COLUMN.map((item, index) => (
                            <Collapse title={item.question} key={index} borderBottom={true}>
                                <Markdown className={styles.answer} options={markdownOptions}>
                                    {item.answer}
                                </Markdown>
                            </Collapse>
                        ))}
                    </div>
                    <div className={styles.column}>
                        {RIGHT_COLUMN.map((item, index) => (
                            <Collapse title={item.question} key={index} borderBottom={true}>
                                <Markdown className={styles.answer} options={markdownOptions}>
                                    {item.answer}
                                </Markdown>
                            </Collapse>
                        ))}
                    </div>
                </div>
            </Accordion>
        </section>
    );
};
