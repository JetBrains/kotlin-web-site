import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { CaseStudiesGrid } from '../../case-studies/grid/case-studies-grid';
import { FilteredCasesProvider, FilterOptions } from '../../case-studies/filter/use-filtered-cases';
import { CaseItem } from '../../case-studies/case-studies';

import styles from './grid.module.css';
import { Button } from '@rescui/button';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

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

export function CaseStudies() {
    const router = useRouter();
    const textCn = useTextStyles();
    const isMS = useMS();

    const handleNavigate = useCallback((e) => {
        e.preventDefault();
        router.replace({ hash: '' }, undefined, { scroll: false, shallow: true });
        router.push(LINK_CASES);
    }, [router]);

    return (
        <FilteredCasesProvider filter={FILTER} preprocess={filterHighlighted}>
            <section className={cn(styles.section, 'ktl-layout', 'ktl-layout--center')}>
                <h2 className={cn(styles.title, textCn('rs-h1'))}>Real-world success stories</h2>
                <CaseStudiesGrid mode={'rock'} className={styles.grid}/>
                <Button size={isMS ? 'm' : 'l'} mode={'outline'} href={LINK_CASES} onClick={handleNavigate}>
                    Explore more customer stories
                </Button>
            </section>
        </FilteredCasesProvider>
    );
}
