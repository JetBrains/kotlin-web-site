import { CaseStudyCard } from '../card/case-studies-card';
import styles from './case-studies-grid.module.css';
import { useFilteredCases } from '../filter/use-filtered-cases';

export const CaseStudiesGrid: React.FC = () => {
    const cases = useFilteredCases();

    return (
        <section className="ktl-layout ktl-layout--center" data-testid="case-studies-grid"
                 aria-label="Case Studies Grid">
            <div role="list" className={styles.grid}>
                {cases.map((caseItem) =>
                    <CaseStudyCard key={caseItem.id} {...caseItem} />
                )}
            </div>
        </section>
    );
};