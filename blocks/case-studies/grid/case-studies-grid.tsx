import { FC } from 'react';
import cn from 'classnames';
import { CaseStudyCard, CaseStudyCardProps } from '../card/case-studies-card';
import { useFilteredCases } from '../filter/use-filtered-cases';
import { MasonryGrid } from '../../../components/masonry-grid/masonry-grid';
import { EmptyState } from '../../../components/empty-state/empry-state';
import { ThemeProvider } from '@rescui/ui-contexts';

import styles from './case-studies-grid.module.css';

export type CaseStudiesGridProps = {
    className?: string;
    mode?: CaseStudyCardProps['mode'];
    showCopyLinkButton?: CaseStudyCardProps['showCopyLinkButton'];
};

export const CaseStudiesSection: FC<CaseStudiesGridProps> = ({ className, ...props }) => (
    <section className={cn(className, 'ktl-layout ktl-layout--center')} aria-label="Case Studies Grid">
        <CaseStudiesGrid {...props} showCopyLinkButton={true} />
    </section>
);

export const CaseStudiesGrid: FC<CaseStudiesGridProps> = ({ className, mode, showCopyLinkButton }) => {
    const cases = useFilteredCases();
    const theme = 'light';

    return (
        <ThemeProvider theme={theme}>
            <div className={cn(styles.wrapper, className)} data-testid="case-studies-grid">
                {cases.length === 0 ? (
                    <EmptyState />
                ) : (
                    <MasonryGrid
                        items={cases}
                        columnCount={2}
                        gap={32}
                        renderItem={(caseItem) => (
                            <CaseStudyCard mode={mode} showCopyLinkButton={showCopyLinkButton} {...caseItem} />
                        )}
                        getKey={(caseItem) => caseItem.id}
                    />
                )}
            </div>
        </ThemeProvider>
    );
};
