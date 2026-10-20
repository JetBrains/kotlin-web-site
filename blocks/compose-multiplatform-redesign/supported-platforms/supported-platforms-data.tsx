import React, { ReactNode } from 'react';

// Copy verbatim from the mock.
export const SUPPORTED_PLATFORMS_TITLE: ReactNode = 'Supported platforms';

export type SupportedPlatform = {
    id: string;
    icon: string;
    title: ReactNode;
    tag: ReactNode;
    isBeta?: boolean;
    text: ReactNode;
};

export const SUPPORTED_PLATFORMS: SupportedPlatform[] = [
    {
        id: 'android',
        icon: '/images/compose-multiplatform-redesign/supported-platforms-android.svg',
        title: 'Android',
        tag: 'Stable',
        text: 'Modern Android development with Jetpack Compose plus the flexibility to share your UI across platforms.',
    },
    {
        id: 'ios',
        icon: '/images/compose-multiplatform-redesign/supported-platforms-apple.svg',
        title: 'iOS',
        tag: 'Stable',
        text: 'Bring Kotlin to iOS to build native apps with a familiar development experience and native performance.',
    },
    {
        id: 'desktop',
        icon: '/images/compose-multiplatform-redesign/supported-platforms-computer.svg',
        title: 'Desktop',
        tag: 'Stable',
        text: 'Build powerful desktop apps for Windows, macOS, and Linux from one codebase.',
    },
    {
        id: 'web',
        icon: '/images/compose-multiplatform-redesign/supported-platforms-globus.svg',
        title: 'Web',
        tag: 'Beta',
        isBeta: true,
        text: 'Bring your Compose UI to the browser with Kotlin and WebAssembly.',
    },
];
