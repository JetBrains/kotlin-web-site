export type PlatformData = {
    id: string;
    icon: string;
    title: string;
    titleLink: string;
    text?: string;
    tagText?: string;
}

export const platformsData: PlatformData[] = [
    {
        id: 'iOS',
        icon: 'ios',
        title: 'iOS',
        titleLink:
            '/docs/multiplatform/compose-multiplatform-create-first-app.html',
        tagText: 'Stable'
    },
    {
        id: 'Android',
        icon: 'android',
        title: 'Android',
        titleLink:
            '/docs/multiplatform/compose-multiplatform-create-first-app.html',
        text: 'via Jetpack Compose'
    },
    {
        id: 'Desktop',
        icon: 'desktop',
        title: 'Desktop',
        titleLink:
            '/docs/multiplatform/compose-multiplatform-create-first-app.html',
        text: 'Windows,\u00A0MacOS,\u00A0Linux'
    },
    {
        id: 'Web',
        icon: 'web',
        title: 'Web',
        titleLink: 'https://kotl.in/wasm-compose-example',
        tagText: 'Beta'
    }
];