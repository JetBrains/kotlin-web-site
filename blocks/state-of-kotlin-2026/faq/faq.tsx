import React, { FC } from 'react';
import Head from 'next/head';
import cn from 'classnames';
import { Accordion, Collapse } from '@rescui/collapse';
import { useTextStyles } from '@rescui/typography';

import styles from './faq.module.css';

type FaqItem = { question: string; answer: string };

const LEFT_COLUMN: FaqItem[] = [
    {
        question: 'How many developers use Kotlin?',
        answer: 'Kotlin has around 8.1M developers worldwide, spanning independent developers to large enterprises.',
    },
    {
        question: 'Is Kotlin growing?',
        answer: 'Yes. Kotlin has grown steadily for 15 years and continues to rank among the fastest-growing languages in independent surveys like GitHub Octoverse and Stack Overflow.',
    },
    {
        question: 'What has changed in Kotlin over 15 years?',
        answer: 'Kotlin has expanded from an Android-first language into a multiplatform, full-stack language used for backend, multiplatform, and increasingly AI development.',
    },
    {
        question: 'Is Kotlin mature enough for enterprise development?',
        answer: 'Yes. 80% of Kotlin developers report using it in production code, and Kotlin has long-term backing from JetBrains and the Kotlin Foundation.',
    },
    {
        question: 'Which companies use Kotlin in production?',
        answer: 'Companies including Google, Amazon, Wolt, ING, Booking.com, Duolingo, and Sony use Kotlin in production. See the case studies throughout this report.',
    },
    {
        question: 'Are there enough experienced Kotlin developers?',
        answer: 'Two-thirds of surveyed Kotlin developers report more than two years of experience with the language.',
    },
    {
        question: 'Is Kotlin Multiplatform production-ready for organizations?',
        answer: 'Yes. Kotlin Multiplatform has been stable since 2023, and Compose Multiplatform for iOS has been stable since 2025.',
    },
];

const RIGHT_COLUMN: FaqItem[] = [
    {
        question: 'How many companies use Kotlin Multiplatform?',
        answer: "KMP's share among cross-platform developers more than doubled in one year, from 7% in 2024 to 18% in 2025.",
    },
    {
        question: 'Is Kotlin good for backend development?',
        answer: 'Yes. Over half of Kotlin developers work on backend projects, and Kotlin compiles to the same bytecode as Java, allowing gradual, service-by-service adoption.',
    },
    {
        question: 'Is Kotlin a safe long-term choice for JVM backend development?',
        answer: 'Kotlin has a strategic Spring partnership since 2025 and a security and support policy for the Kotlin stdlib since 2026.',
    },
    {
        question: 'Why do Java teams adopt Kotlin?',
        answer: 'Java teams often adopt Kotlin during modernization moments, such as Spring Boot version migrations, when they’re already revisiting their codebase.',
    },
    {
        question: 'How can a Java team adopt Kotlin incrementally?',
        answer: "Kotlin's full interoperability with Java means teams can introduce it file by file or service by service, without a disruptive rewrite.",
    },
    {
        question: 'Does Kotlin improve developer productivity compared with Java?',
        answer: 'Kotlin backend tasks show 15–20% shorter development cycles than comparable Java tasks, based on IDE telemetry from JetBrains Research.',
    },
    {
        question: 'How many Kotlin developers use AI?',
        answer: '93% of surveyed Kotlin developers use at least one AI coding tool, and 81% already use or are likely to try AI coding agents.',
    },
];

/**
 * https://schema.org/FAQPage, so the questions can surface as rich results.
 * Both columns are one list here: the split is layout only.
 */
const FAQ_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [...LEFT_COLUMN, ...RIGHT_COLUMN].map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
        },
    })),
};

export const Faq: FC = () => {
    const textCn = useTextStyles();

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
                                {item.answer}
                            </Collapse>
                        ))}
                    </div>
                    <div className={styles.column}>
                        {RIGHT_COLUMN.map((item, index) => (
                            <Collapse title={item.question} key={index} borderBottom={true}>
                                {item.answer}
                            </Collapse>
                        ))}
                    </div>
                </div>
            </Accordion>
        </section>
    );
};
