export interface Warning {
    code: string;
    message: string;
    pageId: string;
    blockId?: string;
    notionUrl?: string;
}

export interface SitePage {
    /** Id of the synced root page this page belongs to. */
    siteId: string;
    /** Route segments below `/pages/`, e.g. `['kotlin-home', 'get-started']`. */
    segments: string[];
    path: string;
    title: string;
    meta?: {
        title?: string;
        description?: string;
    };
}

/** All generated pages, built from the page data at build time. Used to turn links between Notion pages into site URLs. */
export interface SiteIndex {
    /** Keyed by the canonical (dashed) Notion page id. */
    pages: Record<string, SitePage>;
    /** Notion image URL → local URL of the downloaded copy. */
    assets: Record<string, string>;
    warnings: Warning[];
}
