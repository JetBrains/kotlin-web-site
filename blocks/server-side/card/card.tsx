import React, { FC } from 'react';

import cn from 'classnames';

import styles from './card.module.css';
import { useTextStyles } from '@rescui/typography';

interface CardProps {
    title: string;
    description: string;
}

export const Card: FC<CardProps> = ({ title, description }) => {

    const textCn = useTextStyles();

    return (
        <div className={styles.card}>
            <h3 className={cn(textCn('rs-h3'), styles.cardTitle)}>{title}</h3>
            <p className={cn(textCn('rs-text-2'), styles.cardDescription)}>
                {description}
            </p>
        </div>
    );
};
