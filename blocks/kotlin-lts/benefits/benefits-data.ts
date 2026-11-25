export const SUPPORT_COMPARISON = [
    [
        'Scope',
        'Kotlin standard library for the JVM',
        'Choose from Kotlin (compiler, standard library, and build plugins), kotlinx libraries (including coroutines and serialization), Ktor, Exposed, and Compose Multiplatform.',
    ],
    [
        'Versions',
        'Kotlin 2.4 and later, with 18 months of support per language release',
        'Request backports for older or newer versions, including releases before Kotlin 2.4. You and the Kotlin team set the support period.',
    ],
    [
        'Delivery',
        'Through public Kotlin releases',
        'Patched builds from a subscriber-only repository',
    ],
    [
        'Best for',
        'Teams that can take a public standard-library update in their normal release cycle',
        'Teams that need a security fix for their current stack when a broader upgrade would require dependency changes, recertification, or other significant migration effort',
    ],
] as const;
