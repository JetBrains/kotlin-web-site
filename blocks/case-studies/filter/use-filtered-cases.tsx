import { CaseItem } from '../case-studies';
import { parseCompose, parsePlatforms, parseType } from '../utils';
import caseStudiesDataRaw from '../../../data/case-studies/case-studies.yml';
import { useRouter } from 'next/router';
import { createContext, ReactNode, useContext, useMemo } from 'react';

const CaseStudiesContext = createContext<CaseItem[]>([]);

/**
 * Returns the list of case studies from a static source filtered according to the URL query parameters.
 * Supported query parameters:
 * - type: 'all' | 'multiplatform' | 'server-side'
 * - platforms: string[] (array of platform ids)
 * - compose: boolean
 */
export const useFilteredCases = (): CaseItem[] => {
    return useContext(CaseStudiesContext);
};

/**
 * Represents the properties for the FilteredCases component.
 *
 * @typedef {Object} FilteredCasesProviderProps
 *
 * @property {FilterOptions} filter - The filter options used to determine which cases are displayed.
 * @property {(items: CaseItem[]) => CaseItem[]} [preprocess] - An optional function that can be used to preprocess the case studies before filtering.
 * @property {ReactNode} children - The child components or elements to be rendered within the FilteredCases component.
 */
export type FilteredCasesProviderProps = {
    filter: FilterOptions,
    preprocess?: (items: CaseItem[]) => CaseItem[]
    children: ReactNode
}

/**
 * FilteredCasesProvider is a React component that provides a filtered list of case study items
 * through a context. It takes a filter configuration and child components as props.
 *
 * @param {FilteredCasesProviderProps} props - The properties passed to the component.
 */
export const FilteredCasesProvider = (props: FilteredCasesProviderProps) => {
    const { preprocess, children, filter } = props;
    const { type, platforms, compose } = filter;

    const source: CaseItem[] = caseStudiesDataRaw.items;

    const data = useMemo(() => filterCaseStudies(source, {
        type,
        platforms,
        compose
    }), [type, platforms, compose, source]);

    const items = useMemo(() => preprocess ? preprocess(data) : data, [preprocess, data]);

    return <CaseStudiesContext.Provider value={items}>{children}</CaseStudiesContext.Provider>;
};

/**
 * RouterCasesProvider is a functional component that provides a filter object
 * derived from the router query parameters to its child components via the
 * FilteredCasesProvider context. It utilizes the Next.js useRouter hook to
 * access query parameters and memoizes the filter to optimize re-rendering.
 *
 * Props:
 * - children: React.ReactNode - The child components to render within this provider.
 */
export const RouterCasesProvider: React.FC = ({ children }) => {
    const router = useRouter();

    const filter = useMemo(() => ({
        type: parseType(router.query.type),
        platforms: parsePlatforms(router.query.platforms),
        compose: parseCompose(router.query.compose)
    }), [router.query.type, router.query.platforms, router.query.compose]);

    return <FilteredCasesProvider filter={filter}>{children}</FilteredCasesProvider>;
};

export interface FilterOptions {
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
