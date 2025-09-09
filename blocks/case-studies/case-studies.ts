export type Platform =
    | 'android'
    | 'ios'
    | 'desktop'
    | 'frontend'
    | 'backend'
    | 'compose-multi-platform';

type CaseType = 'multiplatform' | 'server-side';

type Media =
    | { type: 'youtube'; url: string }
    | { type: 'image'; path: string };

interface Signature {
    // line1 — markdown (e.g., **Name Surname**, Role)
    line1: string;
    // line2 — plain text
    line2: string;
}

interface CaseCardItem {
    // 0–2 logos: single or pair (for KMP + Compose special card)
    logos?: [string] | [string, string];
    // markdown-enabled description
    description: string;
    signature?: Signature;
    // "Read the full story →"
    readMoreUrl?: string;
    // "Explore the stories"
    exploreUrl?: string;
    caseType: CaseType;
    platforms?: Platform[];
    media?: Media;
}