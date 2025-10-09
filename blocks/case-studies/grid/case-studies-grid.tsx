import { CaseStudyCard } from '../card/case-studies-card';
import styles from './case-studies-grid.module.css';
import { useFilteredCases } from '../filter/use-filtered-cases';
import { MasonryGrid } from '../../../components/masonry-grid/masonry-grid';

export const CaseStudiesGrid: React.FC = () => {
    const cases = useFilteredCases();

    return (
        <section className="ktl-layout ktl-layout--center" data-testid="case-studies-grid"
                 aria-label="Case Studies Grid">
            <div className={styles.wrapper}>
                <MasonryGrid
                    items={cases}
                    columnCount={2}
                    gap={32}
                    renderItem={(caseItem) => <CaseStudyCard {...caseItem} />}
                    getKey={(caseItem) => caseItem.id}
                />
            </div>
        </section>
    );
};