import { BasePage } from './base-page';
import { GlobalSearch } from '../component/global-search';

export interface PageWithGlobalSearch extends BasePage {
    readonly globalSearch: GlobalSearch;
}
