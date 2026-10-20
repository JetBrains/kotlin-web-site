import React, { FC } from 'react';
import cn from 'classnames';
import { Accordion, Collapse } from '@rescui/collapse';
import { useTextStyles } from '@rescui/typography';

import { FAQ_ANSWER_PLACEHOLDER, FAQ_COLUMNS, FAQ_TITLE } from './faq-data';

import styles from './faq.module.css';

export const FaqSection: FC = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} id="faq" data-testid="compose-multiplatform-redesign-faq">
            <h2 className={cn(styles.title, textCn('rs-h1'))} data-testid="compose-multiplatform-redesign-faq-title">
                {FAQ_TITLE}
            </h2>
            <div className={styles.columns}>
                {FAQ_COLUMNS.map((column, index) => (
                    <Accordion key={index} className={styles.column}>
                        {column.map((item) => (
                            <Collapse key={item.id} title={item.question}>
                                <p className={cn(styles.answer, textCn('rs-text-2'))}>{FAQ_ANSWER_PLACEHOLDER}</p>
                            </Collapse>
                        ))}
                    </Accordion>
                ))}
            </div>
        </section>
    );
};
