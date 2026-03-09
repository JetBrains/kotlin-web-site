import React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { createTextCn } from '@rescui/typography';
import { ThemeProvider } from '@rescui/ui-contexts';
import styles from './case-study-page-hero.module.css';

export interface CaseStudyContentProps {
    frontmatter?: {
        title: string;
        coverImg?: string;
        [key: string]: any;
    };
}

export const CaseStudyPageHero: React.FC<CaseStudyContentProps> = ({ frontmatter }) => {
    const textCn = createTextCn('dark');

    return (
        <ThemeProvider theme="dark">
            <div className={cn(styles.wrapper, { [styles.wrapperWithCover]: !!frontmatter?.coverImg })}>
                <section className="ktl-layout ktl-layout--center">
                    {frontmatter?.title && (
                        <h1 className={cn(textCn('rs-hero'), styles.title)}>{frontmatter.title}</h1>
                    )}
                    {frontmatter && <InfoColumns frontmatter={frontmatter} />}
                </section>
            </div>
            {frontmatter.coverImg &&
                <div className={cn('ktl-layout ktl-layout--center', styles.coverImgContainer)}>
                    <img className={styles.coverImg} src={frontmatter.coverImg} alt={frontmatter.title} />
                </div>}
        </ThemeProvider>
    );
};

interface InfoItem {
    label: string;
    value: React.ReactNode;
}

interface InfoColumnsProps {
    frontmatter: NonNullable<CaseStudyContentProps['frontmatter']>;
    columnsCount?: number;
    className?: string;
}

const InfoColumns: React.FC<InfoColumnsProps> = ({ frontmatter, columnsCount = 3, className }) => {
    const textCn = createTextCn('dark');

    const items: InfoItem[] = [
        { label: 'Company', value: frontmatter.title },
    ];

    if (frontmatter.industry) {
        items.push({ label: 'Industry', value: frontmatter.industry });
    }
    if (frontmatter.size) {
        items.push({ label: 'Size', value: frontmatter.size });
    }
    if (frontmatter.usedProductTitle) {
        items.push({
            label: 'JetBrains products used',
            value: frontmatter.usedProductLink ? (
                <Link href={frontmatter.usedProductLink}>
                    {frontmatter.usedProductTitle}
                </Link>
            ) : frontmatter.usedProductTitle
        });
    }
    if (frontmatter.country) {
        items.push({ label: 'Country', value: frontmatter.country });
    }

    const itemsPerColumn = Math.ceil(items.length / columnsCount);
    const columns: InfoItem[][] = Array.from({ length: columnsCount }, (_, columnIndex) => {
        const startIndex = columnIndex * itemsPerColumn;
        const endIndex = startIndex + itemsPerColumn;
        return items.slice(startIndex, endIndex);
    });

    return (
        <div className={cn(styles.infoSection, textCn('rs-text-2'), className)}>
            {columns.map((column, colIndex) => (
                <div key={colIndex} className={styles.infoBlock}>
                    {column.map((item: InfoItem) => (
                        <div key={item.label}>
                            <span className={styles.infoLabel}>{item.label}:</span>{' '}
                            <span className={styles.infoValue}>{item.value}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
