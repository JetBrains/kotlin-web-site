import React, { FC, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Head from 'next/head';
import cn from 'classnames';
import { Accordion, Collapse } from '@rescui/collapse';
import { useTextStyles } from '@rescui/typography';

import styles from './columned-faq.module.css';

export type ColumnedFaqItem = {
    question: string;
    answer: ReactNode;
};

type ColumnedFaqProps = {
    items: ColumnedFaqItem[];
    title?: ReactNode;
    columnsCount?: number;
    className?: string;
};

const splitIntoColumns = (items: ColumnedFaqItem[], columnsCount: number) => {
    const itemsPerColumn = Math.ceil(items.length / columnsCount);

    return Array.from({ length: columnsCount }, (_, index) =>
        items.slice(index * itemsPerColumn, (index + 1) * itemsPerColumn)
    );
};

const createFaqSchema = (items: ColumnedFaqItem[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: renderToStaticMarkup(<>{answer}</>),
        },
    })),
});

export const ColumnedFaq: FC<ColumnedFaqProps> = ({ items, title, columnsCount = 2, className }) => {
    const textCn = useTextStyles();
    const columns = splitIntoColumns(items, columnsCount);

    return (
        <div className={cn(styles.faq, className)} data-testid="columned-faq">
            <Head>
                <script
                    type="application/ld+json"
                    key="columned-faq-schema"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(createFaqSchema(items)) }}
                />
            </Head>
            {title && (
                <h2 className={cn(styles.title, textCn('rs-h1'))} data-testid="columned-faq-title">
                    {title}
                </h2>
            )}
            <Accordion>
                <div className={styles.columns}>
                    {columns.map((column, index) => (
                        <div key={index} className={styles.column}>
                            {column.map(({ question, answer }) => (
                                <Collapse key={question} title={question}>
                                    {answer}
                                </Collapse>
                            ))}
                        </div>
                    ))}
                </div>
            </Accordion>
        </div>
    );
};
