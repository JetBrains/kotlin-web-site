import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './questions.module.css';

const QUESTIONS = [
    {
        question: 'Is Kotlin here to stay?',
        answer: '15 years of growth, ecosystem investment, and organizational adoption.',
        linkText: 'See the evidence →',
        anchor: 'growth',
    },
    {
        question: 'Can we adopt Kotlin without a disruptive rewrite?',
        answer: 'Backend adoption, Java interoperability, and modernization paths.',
        linkText: 'See how teams adopt Kotlin →',
        anchor: 'backend',
    },
    {
        question: 'Can Kotlin scale across platforms?',
        answer: 'Kotlin Multiplatform adoption, production use, and reported business outcomes.',
        linkText: 'See the KMP findings →',
        anchor: 'multiplatform',
    },
    {
        question: 'How does Kotlin fit into the AI era?',
        answer: 'AI-assisted development, public benchmark results, and AI systems built with Kotlin.',
        linkText: 'See the Kotlin + AI findings →',
        anchor: 'ai',
    },
];

const scrollToAnchor = (event: React.MouseEvent, anchor: string) => {
    event.preventDefault();
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
};

export const Questions: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} data-testid="sok-questions">
            <div className={styles.panel}>
                <div className={styles.grid}>
                    {QUESTIONS.map((item, index) => (
                        <div className={styles.card} key={index}>
                            <h2 className={cn(styles.question, textCn('rs-h1'))}>{item.question}</h2>
                            <div className={cn(styles.body, textCn('rs-text-1', { hardness: 'hard' }))}>
                                <p className={styles.answer}>{item.answer}</p>
                                <a
                                    href={`#${item.anchor}`}
                                    className={cn(textCn('rs-link'), styles.link)}
                                    onClick={(event) => scrollToAnchor(event, item.anchor)}
                                >
                                    {item.linkText}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
