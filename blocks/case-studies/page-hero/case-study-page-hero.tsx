import React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { createTextCn, useTextStyles } from '@rescui/typography';
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
                </section>
            </div>
            {frontmatter.coverImg &&
                <div className={cn('ktl-layout ktl-layout--center', styles.coverImgContainer)}>
                    <img className={styles.coverImg} src={frontmatter.coverImg} alt={frontmatter.title} />
                </div>}
        </ThemeProvider>
    );
};
