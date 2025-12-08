import { CaseStudiesGrid } from '../../case-studies/grid/case-studies-grid';
import { FilteredCasesProvider, FilterOptions } from '../../case-studies/filter/use-filtered-cases';
import { CaseItem } from '../../case-studies/case-studies';

const FILTER: FilterOptions = {
    type: 'multiplatform'
} as const;

const CASES_HIGHLIGHTED: Readonly<CaseItem['id'][]> = Object.freeze([
    'case-study-mcdonalds-umain',
    'case-study-wrike',
    'case-study-netflix',
    'case-study-google-workspace',
    'case-study-bilibili',
    'case-study-x',
    'case-study-duolingo'
].reverse());

function filterHighlighted(items: CaseItem[]) {
    const lastOfHighlighted = Math.min(items.length, Math.max(CASES_HIGHLIGHTED.length, 7));
    return [...items]
        .sort((a, b) => CASES_HIGHLIGHTED.indexOf(b.id) - CASES_HIGHLIGHTED.indexOf(a.id))
        .slice(0, lastOfHighlighted);
}

export function CaseStudies() {
    return (
        <FilteredCasesProvider filter={FILTER} preprocess={filterHighlighted}>
            <CaseStudiesGrid />
        </FilteredCasesProvider>
    );
}
