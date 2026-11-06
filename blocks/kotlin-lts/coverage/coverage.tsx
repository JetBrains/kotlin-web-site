import React, { FC } from 'react';
import cn from 'classnames';
import { cardCn } from '@rescui/card';
import { useTextStyles } from '@rescui/typography';

import { SECTION_IDS } from '../constants';
import { COVERAGE_ITEMS } from './coverage-data';

import shared from '../kotlin-lts.module.css';
import styles from './coverage.module.css';

export const Coverage: FC = () => {
    const textCn = useTextStyles();

    return (
        <section
            id={SECTION_IDS.coverage}
            className={cn(shared.section, shared.light)}
            data-testid="lts-coverage"
        >
            <div className="ktl-layout ktl-layout--center">
                <h2 className={cn(textCn('rs-h1'), shared.title)} data-testid="lts-coverage-title">
                    Extended maintenance for your whole Kotlin stack
                </h2>

                <ul className={styles.grid}>
                    {COVERAGE_ITEMS.map(({ id, badge, title, text }) => (
                        <li
                            key={id}
                            className={cn(cardCn({ paddings: 24, borderRadius: 16 }), styles.card)}
                            data-testid="lts-coverage-item"
                        >
                            <span className={styles.badge} aria-hidden="true">
                                {badge}
                            </span>
                            <h3 className={cn(textCn('rs-h4'), styles.cardTitle)}>{title}</h3>
                            <p className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.cardText)}>
                                {text}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};
