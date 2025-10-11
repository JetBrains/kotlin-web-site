export type CaseType = 'multiplatform' | 'server-side';

export type  CaseTypeSwitch = 'all' | CaseType;

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
    name: string;
    position: string;
}

type YoutubeMedia = {
    type: 'youtube';
    videoId: string;
};

type ImageMedia = {
    type: 'image';
    path: string;
};

type Media = YoutubeMedia | ImageMedia;

export interface CaseItem {
    id: string;
    type: CaseType;
    description: string;
    isExternal?: boolean;
    link?: string;
    linkText?: string;
    linkStyle?: 'button' | 'text';
    logo?: string[];
    signature?: Signature;
    platforms?: CasePlatform[];
    media?: Media;
    featuredOnMainPage?: boolean;
}
