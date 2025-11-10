import { CaseItem } from '../case-studies';
import { parseCompose, parsePlatforms, parseType } from '../utils';
import caseStudiesDataRaw from '../../../data/case-studies/case-studies.yml';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

/**
 * Returns the list of case studies from a static source filtered according to the URL query parameters.
 * Supported query parameters:
 * - type: 'all' | 'multiplatform' | 'server-side'
 * - platforms: string[] (array of platform ids)
 * - compose: boolean
 */
export const useFilteredCases = (): CaseItem[] => {
    const router = useRouter();

    const type = useMemo(() => parseType(router.query.type), [router.query.type]);
    const platforms = useMemo(() => parsePlatforms(router.query.platforms), [router.query.platforms]);
    const compose = useMemo(() => parseCompose(router.query.compose), [router.query.compose]);

    const source: CaseItem[] = caseStudiesDataRaw.items;

    return useMemo(() =>
            filterCaseStudies(source, { type, platforms, compose }),
        [type, platforms, compose]);
};

interface FilterOptions {
    type?: string | null;
    platforms?: string[];
    compose?: boolean;
}

export const filterCaseStudies = (
    source: CaseItem[],
    { type, platforms = [], compose = false }: FilterOptions
): CaseItem[] => {
    /**
     * Matches if:
     * - no platform filter is selected
     * - case has ALL platforms that match the filter
     * - special case: 'kotlin-multiplatform' case is considered to have all platforms
     */
    const matchesPlatformFilter = (caseItem: CaseItem): boolean => {
        if (platforms.length === 0) {
            return true;
        }
        const isSpecialKotlinMultiplatformCase = caseItem.id === 'kotlin-multiplatform';
        return (platforms).every((platform: string) => (caseItem.platforms || [] as string[]).includes(platform)) || isSpecialKotlinMultiplatformCase;
    };

    /**
     * Matches if:
     * - compose filter is not selected
     * - case has compose-multiplatform platform
     * - special case: 'kotlin-multiplatform' case is considered to match compose filter
     */
    const matchesComposeFilter = (caseItem: CaseItem): boolean => {
        if (!compose) {
            return true;
        }
        const isSpecialKotlinMultiplatformWithComposeCase = caseItem.id === 'kotlin-multiplatform';
        return (caseItem.platforms || []).includes('compose-multiplatform') || isSpecialKotlinMultiplatformWithComposeCase;
    };

    return source.filter((caseItem) => {
        const isMultiplatformCase = caseItem.type === 'multiplatform';
        const isServerSideCase = caseItem.type === 'server-side';

        if (type === 'server-side') {
            return isServerSideCase;
        }

        if (type === 'multiplatform') {
            return isMultiplatformCase
                && matchesPlatformFilter(caseItem)
                && matchesComposeFilter(caseItem);
        }

        // for "all" types show all server-side cases
        if (isServerSideCase) {
            return true;
        }

        // for "all" types show multiplatform cases only if they match the filters
        return matchesPlatformFilter(caseItem) && matchesComposeFilter(caseItem);
    });
};
