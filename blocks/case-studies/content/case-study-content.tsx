import React from 'react';
import cn from 'classnames';
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
            {frontmatter?.coverImg && (
                <img className={styles.coverImg} src={frontmatter.coverImg} alt={frontmatter.title} />
            )}
            <div className={textCn('rs-text-1')}>
                <Markdown options={{ forceBlock: true }}>{content}</Markdown>
            </div>
        </div>
    );
};
