import React, { ReactNode } from 'react';

// Copy verbatim from the mock.
export const ANDROID_SKILLS_EVERY_COPY: { id: string; text: ReactNode }[] = [
    { id: 'android-skills-every-1', text: 'Android skills. Every platform.' },
    { id: 'android-skills-every-2', text: 'Use your Jetpack Compose skills across platforms.' },
    {
        id: 'android-skills-every-3',
        text: 'Compose Multiplatform supports familiar APIs like state management, layout, and animations as well as Material components, making it easy to bring your Android architecture to other platforms.',
    },
    { id: 'android-skills-every-4', text: 'Production-ready for mobile and desktop' },
    { id: 'android-skills-every-5', text: '2×' },
    { id: 'android-skills-every-6', text: 'more top 10K apps use Kotlin Multiplatform than a year ago' },
    { id: 'android-skills-every-7', text: '81%' },
    { id: 'android-skills-every-8', text: 'of Kotlin Multiplatform developers use Compose Multiplatform' },
    { id: 'android-skills-every-9', text: '93%' },
    {
        id: 'android-skills-every-10',
        text: 'of developers report a native-like experience with Compose Multiplatform on iOS',
    },
];

export const ANDROID_SKILLS_EVERY_STATS: { value: string; text: string }[] = [
    { value: '2×', text: 'more top 10K apps use Kotlin Multiplatform than a year ago' },
    { value: '81%', text: 'of Kotlin Multiplatform developers use Compose Multiplatform' },
    { value: '93%', text: 'of developers report a native-like experience with Compose Multiplatform on iOS' },
];
