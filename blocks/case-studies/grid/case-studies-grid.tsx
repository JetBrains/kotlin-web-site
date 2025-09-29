import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import caseStudiesDataRaw from '../../../data/case-studies/case-studies.yml';
import { CaseStudyCard } from '../card/case-studies-card';
import { CaseItem } from '../case-studies';
import { parseCompose, parsePlatforms, parseType } from '../utils';
import styles from './case-studies-grid.module.css';

export const CaseStudiesGrid: React.FC = () => {
    const router = useRouter();

    const type = parseType(router.query.type);
    const platforms = useMemo(() => parsePlatforms(router.query.platforms), [router.query.platforms]);
    const compose = parseCompose(router.query.compose);

    const items = useMemo(() => {
        const source: CaseItem[] = caseStudiesDataRaw.items;
        return source.filter((caseItem) => {
            const isMultiplatformCase = caseItem.type === 'multiplatform';
            const isServerSideCase = caseItem.type === 'server-side';

            if (type === 'server-side') {
                return isServerSideCase;
            }
            if (type === 'multiplatform') {
                // Only multiplatform items with filters applied
                if (!isMultiplatformCase) {
                    return false;
                }
                // Compose filter
                if (compose && !(caseItem.platforms || []).includes('compose-multiplatform')) {
                    return false;
                }
                // Platform filter applies only to MP: must intersect
                const intersects = (caseItem.platforms || []).some((p: string) => (platforms as string[]).includes(p));
                return intersects;
            }
            // type === 'all': include server-side as is; apply filters to MP only
            if (isServerSideCase) {
                return true;
            }
            // MP item: apply "compose" + "platforms"
            if (compose && !(caseItem.platforms || []).includes('compose-multiplatform')) return false;
            const intersects = (caseItem.platforms || []).some((p: string) => (platforms as string[]).includes(p));
            return intersects;
        });
    }, [type, platforms, compose]);

    return (
        <section className="ktl-layout ktl-layout--center" data-testid="case-studies-grid"
                 aria-label="Case Studies Grid">
            <div role="list" className={styles.grid}>
                {items.map((item) =>
                    <CaseStudyCard key={item.id } {...item} />
                )}
            </div>
        </section>
    );
};