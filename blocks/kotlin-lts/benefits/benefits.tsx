import React, { FC } from 'react';
import cn from 'classnames';
import { cardCn } from '@rescui/card';
import { InfoOutlineIcon } from '@rescui/icons';
import { useTextStyles } from '@rescui/typography';

import { SECTION_IDS } from '../constants';
import { BENEFIT_ITEMS } from './benefits-data';

import shared from '../kotlin-lts.module.css';
import styles from './benefits.module.css';

export const Benefits: FC = () => {
    const textCn = useTextStyles();

    return (
        <section
            id={SECTION_IDS.benefits}
            className={cn(shared.section, shared.soft)}
            data-testid="lts-benefits"
        >
            <div className="ktl-layout ktl-layout--center">
                <h2 className={cn(textCn('rs-h1'), shared.title)} data-testid="lts-benefits-title">
                    What's included
                </h2>

                <aside className={styles.note} data-testid="lts-benefits-note">
                    <InfoOutlineIcon className={styles.noteIcon} />
                    <div>
                        <p className={cn(textCn('rs-h4'), styles.noteTitle)}>Available for a version that you use</p>
                        <p className={cn(textCn('rs-text-2', { hardness: 'average' }), styles.noteText)}>
                            With long-term support, you can stay on your version without major upgrades.
                        </p>
                    </div>
                </aside>

                <ul className={styles.grid}>
                    {BENEFIT_ITEMS.map(({ title, text }, index) => (
                        <li
                            key={title}
                            className={cn(cardCn({ paddings: 32, borderRadius: 16 }), styles.card)}
                            data-testid="lts-benefits-item"
                        >
                            <span className={cn(textCn('rs-text-3'), styles.num)} aria-hidden="true">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className={cn(textCn('rs-h3'), styles.cardTitle)}>{title}</h3>
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
