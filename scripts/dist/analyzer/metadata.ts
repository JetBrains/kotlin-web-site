import { FileType } from '../lib/files/type.js';
import { SearchRecord } from '../lib/search/records.js';

export type MetaPayload = {
    type: FileType,
    records: SearchRecord[]
    modified?: number,
}

export type Metadata = [string, MetaPayload];
