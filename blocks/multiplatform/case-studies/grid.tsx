import { CaseStudiesGrid } from '../../case-studies/grid/case-studies-grid';
import { FilteredCasesProvider, FilterOptions } from '../../case-studies/filter/use-filtered-cases';
import { CaseItem } from '../../case-studies/case-studies';

const FILTER: FilterOptions = {
    type: 'multiplatform'
};

const CASES_HIGHLIGHTED: CaseItem['id'][] = [
    'case-study-mcdonalds-umain',
    'case-study-wrike',
    'case-study-netflix',
    'case-study-google-workspace',
    'case-study-bilibili',
    'case-study-x',
    'case-study-duolingo'
];

function filterHighlighted(items: CaseItem[]) {
    return items
        .filter(item => CASES_HIGHLIGHTED.includes(item.id))
        .sort((a, b) => CASES_HIGHLIGHTED.indexOf(a.id) - CASES_HIGHLIGHTED.indexOf(b.id));
}

export function CaseStudies() {
    return (
        <FilteredCasesProvider filter={FILTER} preprocess={filterHighlighted}>
            <CaseStudiesGrid />
        </FilteredCasesProvider>
    );
}