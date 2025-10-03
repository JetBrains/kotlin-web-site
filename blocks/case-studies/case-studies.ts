export type CaseType = 'multiplatform' | 'server-side';

export type  CaseTypeSwitch = 'all' | CaseType;

type CaseDestination = 'internal' | 'external';

export const Platforms = [
    'android',
    'ios',
    'desktop',
    'frontend',
    'backend',
] as const;

export const PlatformNames: Record<typeof Platforms[number], string> = {
    "android": "Android",
    "ios": "iOS",
    "desktop": "Desktop",
    "frontend": "Frontend",
    "backend": "Backend",
}

export type CasePlatform = typeof Platforms[number] | 'compose-multiplatform';

type Signature = {
    line1: string;
    line2: string;
}

type YoutubeMedia = {
    type: 'youtube';
    url: string;
};

type ImageMedia = {
    type: 'image';
    path: string;
};

type Media = YoutubeMedia | ImageMedia;

interface CaseItemBase {
    id: string;
    type: CaseType;
    description: string;
    destination: CaseDestination;
    logo?: string[];
    signature?: Signature;
    platforms?: CasePlatform[];
    media?: Media;
    featuredOnMainPage?: boolean;
    slug?: string;
    externalLinkText?: string;
}

export interface ExternalDestinationCaseItem extends CaseItemBase {
    destination: 'external';
    // required when destination === 'external'
    externalLink: string;
}

export interface InternalDestinationCaseItem extends CaseItemBase {
    destination: 'internal';
    // required when destination === 'internal'
    pageContentPath: string;
}

export type CaseItem =
    | ExternalDestinationCaseItem
    | InternalDestinationCaseItem;

export function isExternalCase(item: CaseItem): item is ExternalDestinationCaseItem {
    return item.destination === 'external';
}