import React from 'react';
import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Markdown } from '../../../utils/mdToHtml';
import { SocialShare } from '../../../components/social-share/social-share';
import styles from './case-study-page-content.module.css';

export interface CaseStudyContentProps {
    content: string;
}

export const CaseStudyPageContent: React.FC<CaseStudyContentProps> = ({ content }) => {
    const textCn = useTextStyles();

    return (
        <section
            className={cn('ktl-layout ktl-layout--center', textCn('rs-text-1', { hardness: 'hard' }), styles.container)}>
            <Markdown options={{ forceBlock: true }}>{content}</Markdown>
            <SocialShare label="Share:" className={styles.share} />
        </section>
    );
};
