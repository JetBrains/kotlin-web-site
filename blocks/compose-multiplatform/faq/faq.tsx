import React from 'react';
import Head from 'next/head';
import cn from 'classnames';
import { Accordion, Collapse } from '@rescui/collapse';
import { useTextStyles } from '@rescui/typography';

import { FAQ_ITEMS } from './faq-data';
import styles from './faq.module.css';

const COLUMNS_COUNT = 2;
const ITEMS_PER_COLUMN = Math.ceil(FAQ_ITEMS.length / COLUMNS_COUNT);

const COLUMNS = Array.from({ length: COLUMNS_COUNT }, (_, index) =>
    FAQ_ITEMS.slice(index * ITEMS_PER_COLUMN, (index + 1) * ITEMS_PER_COLUMN)
);

const FAQ_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
        },
    })),
};

export const FaqBlock = () => {
    const textCn = useTextStyles();

    return (
        <section className={cn(styles.wrapper, 'ktl-layout', 'ktl-layout--center')} data-testid="faq-block">
            <Head>
                <script
                    type="application/ld+json"
                    key="compose-faq-schema"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
                />
            </Head>
            <h2 className={cn(styles.title, textCn('rs-h1'))} data-testid="faq-title">
                FAQ
            </h2>
            <Accordion>
                <div className={styles.columns}>
                    {COLUMNS.map((column, index) => (
                        <div key={index} className={styles.column}>
                            {column.map(({ question, answer }) => (
                                <Collapse key={question} title={question}>
                                    <p className={cn(styles.answer, textCn('rs-text-2'))}>{answer}</p>
                                </Collapse>
                            ))}
                        </div>
                    ))}
                </div>
            </Accordion>
        </section>
    );
};
