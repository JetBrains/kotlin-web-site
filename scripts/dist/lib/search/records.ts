import { CheerioAPI } from 'cheerio';

export type SearchRecord = {
    objectID: string,
    url: string,
    type: 'Documentation',
    product: 'help/kotlin-reference',
    parent: string | null,
    headings: string,
    mainTitle: string,
    pageTitle: string,
    content: string,
    pageViews: number,
}

const DEFAULT_RECORD_VALUES = Object.freeze({
    content: '',
    type: 'Documentation',
    parent: null,
    pageViews: 0,
    product: 'help/kotlin-reference',
} as const);

export const DEFAULT_RECORD: Pick<SearchRecord, keyof typeof DEFAULT_RECORD_VALUES> = DEFAULT_RECORD_VALUES;

export type GetRecords = ($: CheerioAPI, url: string) => Promise<SearchRecord[]>;

export const withMakeSearchIndex = Boolean(
    process.env.WH_SEARCH_USER &&
    process.env.WH_SEARCH_WRITE_KEY &&
    process.env.ALGOLIA_INDEX_NAME
);

export const withSearchParser = Boolean(process.env.WH_WITH_SEARCH) || withMakeSearchIndex;
