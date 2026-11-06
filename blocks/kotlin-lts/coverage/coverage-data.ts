export type CoverageItem = {
    id: string;
    badge: string;
    title: string;
    text: string;
};

export const COVERAGE_ITEMS: CoverageItem[] = [
    {
        id: 'kotlin',
        badge: 'K',
        title: 'Kotlin compiler',
        text: 'Compiler, standard library, and Gradle and Maven plugins.'
    },
    {
        id: 'serialization',
        badge: '{ }',
        title: 'kotlinx.serialization',
        text: 'Multiplatform serialization runtime and compiler plugin.'
    },
    {
        id: 'kotlinx',
        badge: 'kx',
        title: 'kotlinx libraries',
        text: 'Coroutines, datetime, and other official kotlinx libraries.'
    },
    {
        id: 'ktor',
        badge: 'Kt',
        title: 'Ktor',
        text: 'Asynchronous server and client framework.'
    },
    {
        id: 'exposed',
        badge: 'Ex',
        title: 'Exposed',
        text: 'Lightweight SQL library and ORM for Kotlin.'
    },
    {
        id: 'compose',
        badge: 'C',
        title: 'Compose Multiplatform',
        text: 'Declarative UI framework for Android, iOS, desktop, and web.'
    }
];
