import { CaseStudyCard } from '../card/case-studies-card';
import styles from './case-studies-grid.module.css';
import { useFilteredCases } from '../filter/use-filtered-cases';
import { MasonryGrid } from '../../../components/masonry-grid/masonry-grid';
import { EmptyState } from '../../../components/empty-state/empry-state';
import { ThemeProvider } from '@rescui/ui-contexts';

export const CaseStudiesGrid: React.FC = () => {
    const cases = useFilteredCases();
    const theme = 'light';

    return (
        <section className="ktl-layout ktl-layout--center" data-testid="case-studies-grid"
                 aria-label="Case Studies Grid">
            <ThemeProvider theme={theme}>
                <div className={styles.wrapper}>
                    {cases.length === 0 ?
                        <EmptyState /> :
                        <MasonryGrid
                            items={cases}
                            columnCount={2}
                            gap={32}
                            renderItem={(caseItem) => <CaseStudyCard {...caseItem} />}
                            getKey={(caseItem) => caseItem.id}
                        />}
                </div>
            </ThemeProvider>
        </section>
    );
};
