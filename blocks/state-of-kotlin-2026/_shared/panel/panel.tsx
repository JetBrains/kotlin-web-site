import React, { FC, ReactNode } from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';

import styles from './panel.module.css';

type PanelProps = {
    title?: string;
    children: ReactNode;
    className?: string;
    testId?: string;
};

export const Panel: FC<PanelProps> = ({ title, children, className, testId }) => {
    const textCn = useTextStyles();

    return (
        <div className={cn(styles.panel, className)} data-testid={testId}>
            {title && <h3 className={cn(styles.title, textCn('rs-h3'))}>{title}</h3>}
            {children}
        </div>
    );
};
