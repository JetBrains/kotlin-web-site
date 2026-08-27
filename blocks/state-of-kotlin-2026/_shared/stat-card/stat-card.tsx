import React, { FC } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './stat-card.module.css';

type StatCardProps = {
    figure: string;
    caption: string | React.ReactNode;
    footnote?: string;
    className?: string;
    testId?: string;
};

export const StatCard: FC<StatCardProps> = ({ figure, caption, footnote, className, testId }) => {
    const textCn = useTextStyles();

    return (
        <div className={cn(styles.card, className)} data-testid={testId}>
            <p className={cn(styles.figure, textCn('rs-hero'))}>{figure}</p>
            <p className={cn(styles.caption, textCn('rs-text-1'))}>{caption}</p>
            {footnote && <p className={cn(styles.footnote, textCn('rs-text-3', { hardness: 'pale' }))}>{footnote}</p>}
        </div>
    );
};
