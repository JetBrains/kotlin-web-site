import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { CaseStudiesGrid } from '../../case-studies/grid/case-studies-grid';
import { FilteredCasesProvider, FilterOptions } from '../../case-studies/filter/use-filtered-cases';
import { CaseItem } from '../../case-studies/case-studies';

import styles from './grid.module.css';
import { Button } from '@rescui/button';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

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

const LINK_CASES = '/case-studies/?type=multiplatform' as const;
const ANCHOR_CASES = 'explore-more-customer-stories' as const;

export function CaseStudies() {
    const textCn = useTextStyles();
    const router = useRouter();

    const handleNavigate = useCallback((e) => {
        e.preventDefault();
        router.replace({ hash: '' }, undefined, { scroll: false, shallow: true });
        router.push(LINK_CASES);
    }, [router]);

    return <>
        <h2 className={cn(styles.title, textCn('rs-h1'))}>Real-world success stories</h2>
        <FilteredCasesProvider filter={FILTER} preprocess={filterHighlighted}>
            <CaseStudiesGrid mode={'rock'} />
        </FilteredCasesProvider>
        <a id={ANCHOR_CASES}></a>
        <Button size={'l'} mode={'outline'} href={LINK_CASES} onClick={handleNavigate}>
            Explore more customer stories
        </Button>
    </>;
}
