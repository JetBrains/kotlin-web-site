import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import styles from './page-header.module.css';

interface BenchPageHeaderProps {
    title: React.ReactNode;
    intro: React.ReactNode;
    children?: React.ReactNode;
    testId?: string;
    titleTestId?: string;
    introTestId?: string;
}

export function BenchPageHeader({ title, intro, children, testId, titleTestId, introTestId }: BenchPageHeaderProps) {
    const textCn = useTextStyles();

    return (
        <section className={cn(styles.header, 'ktl-layout', 'ktl-layout--center')} data-testid={testId}>
            <h1 className={cn(styles.title, textCn('rs-hero'))} data-testid={titleTestId}>
                {title}
            </h1>
            <p className={cn(styles.intro, textCn('rs-subtitle-2', { hardness: 'hard' }))} data-testid={introTestId}>
                {intro}
            </p>
            {children && <div className={styles.controls}>{children}</div>}
        </section>
    );
}
