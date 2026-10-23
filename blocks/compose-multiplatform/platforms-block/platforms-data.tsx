export type PlatformId = 'android' | 'ios' | 'desktop' | 'web';

export type PlatformData = {
    id: PlatformId;
    title: string;
    titleLink: string;
    text: string;
    isBeta?: boolean;
}

export const platformsData: PlatformData[] = [
    {
        id: 'android',
        title: 'Android',
        titleLink: '/docs/multiplatform/compose-multiplatform-create-first-app.html',
        text: 'Modern Android development with Jetpack Compose plus the flexibility to share your UI across platforms.'
    },
    {
        id: 'ios',
        title: 'iOS',
        titleLink: '/docs/multiplatform/compose-multiplatform-create-first-app.html',
        text: 'Bring Kotlin to iOS to build native apps with a familiar development experience and native performance.'
    },
    {
        id: 'desktop',
        title: 'Desktop',
        titleLink: '/docs/multiplatform/compose-multiplatform-create-first-app.html',
        text: 'Build powerful desktop apps for Windows, macOS, and Linux from one codebase.'
    },
    {
        id: 'web',
        title: 'Web',
        titleLink: 'https://kotl.in/wasm-compose-example',
        text: 'Bring your Compose UI to the browser with Kotlin and WebAssembly.',
        isBeta: true
    }
];
