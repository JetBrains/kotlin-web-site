import React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { useTextStyles } from '@rescui/typography';
import { Markdown } from '../../../utils/mdToHtml';
import styles from './case-study-content.module.css';

export interface CaseStudyContentProps {
    content: string;
    className?: string;
    frontmatter?: {
        title: string;
        coverImg?: string;
        [key: string]: any;
    };
}

export const CaseStudyContent: React.FC<CaseStudyContentProps> = ({ content, className, frontmatter }) => {
    const textCn = useTextStyles();

    return (
        <div className={cn(styles.wrapper, className)}>
            {frontmatter?.title && (
                <h1 className={cn(textCn('rs-hero'), styles.title)}>{frontmatter.title}</h1>
            )}

            {frontmatter && (
                <div className={cn(styles.infoSection, textCn('rs-text-2'))}>
                    <div className={styles.infoBlock}>
                        <div>
                            <span className={styles.infoLabel}>Company:</span>{' '}
                            <span className={styles.infoValue}>{frontmatter.title}</span>
                        </div>
                        {frontmatter.industry && (
                            <div>
                                <span className={styles.infoLabel}>Industry:</span>{' '}
                                <span className={styles.infoValue}>{frontmatter.industry}</span>
                            </div>
                        )}
                    </div>
                    <div className={styles.infoBlock}>
                        {frontmatter.size && (
                            <div>
                                <span className={styles.infoLabel}>Size:</span>{' '}
                                <span className={styles.infoValue}>{frontmatter.size}</span>
                            </div>
                        )}
                        {frontmatter.usedProductTitle && (
                            <div>
                                <span className={styles.infoLabel}>JetBrains products used:</span>{' '}
                                <span className={styles.infoValue}>
                                    {frontmatter.usedProductLink ? (
                                        <Link href={frontmatter.usedProductLink}>
                                            {frontmatter.usedProductTitle}
                                        </Link>
                                    ) : (
                                        frontmatter.usedProductTitle
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className={styles.infoBlock}>
                        {frontmatter.country && (
                            <div>
                                <span className={styles.infoLabel}>Country:</span>{' '}
                                <span className={styles.infoValue}>{frontmatter.country}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {frontmatter?.coverImg && (
                <img className={styles.coverImg} src={frontmatter.coverImg} alt={frontmatter.title} />
            )}
            <div className={textCn('rs-text-1')}>
                <Markdown options={{ forceBlock: true }}>{content}</Markdown>
            </div>
        </div>
    );
};
