import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './numbers.module.css';

const NUMBER_ITEMS = [
    {
        figure: '8M+',
        caption: 'Kotlin developers worldwide',
        render: '/images/state-of-kotlin-2026/numbers-render-1.webp',
    },
    {
        figure: '50%+',
        caption: 'Use Kotlin for&nbsp;backend tasks',
        render: '/images/state-of-kotlin-2026/numbers-render-2.webp',
    },
    {
        figure: '30%',
        caption: 'Use Kotlin on&nbsp;multiplatform projects',
        render: '/images/state-of-kotlin-2026/numbers-render-3.webp',
    },
    {
        figure: '80%',
        caption: 'Use it in real&nbsp;production environments',
        render: '/images/state-of-kotlin-2026/numbers-render-4.webp',
    },
    {
        figure: '81%',
        caption: 'say AI-generated Kotlin is usually correct or needs only minor fixes',
        render: '/images/state-of-kotlin-2026/numbers-render-5.webp',
    },
    {
        figure: '87%',
        caption: 'Are satisfied or&nbsp;very satisfied with the language',
        render: '/images/state-of-kotlin-2026/numbers-render-6.webp',
    },
];

export const Numbers: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} data-testid="sok-numbers">
            <h2 className={cn(styles.title, textCn('rs-h1'))} data-testid="sok-numbers-title">
                Kotlin: 15 Years in Numbers
            </h2>
            <div className={styles.grid}>
                {NUMBER_ITEMS.map((item, index) => (
                    <div className={styles.card} key={index}>
                        <img src={item.render} alt="" className={styles.render} width={300} height={300} />
                        <p className={cn(styles.figure, textCn('rs-middle-hero'))}>{item.figure}</p>
                        <p className={cn(styles.caption, textCn('rs-text-1', {hardness: 'hard'}))} dangerouslySetInnerHTML={{__html: item.caption}}/>
                    </div>
                ))}
            </div>
        </section>
    );
};
