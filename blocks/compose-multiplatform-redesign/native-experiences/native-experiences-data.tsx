import React, { ReactNode } from 'react';
import styles from './native-experiences.module.css';

// Copy verbatim from the mock, regrouped per card.
export const NATIVE_FEATURES = ['Native scrolling', 'Native gestures', 'Native text editing', 'Native performance'];

export type FeatureCard = { id: string; title: string; text: ReactNode };

export const FEATURE_CARDS: FeatureCard[] = [
    {
        id: 'ai',
        title: 'AI-powered code generation',
        text: (
            <>
                Speed up your UI coding with code generation powered by{' '}
                <a href="https://www.jetbrains.com/junie/" target="_blank" rel="noopener noreferrer">
                    Junie
                </a>
                , the coding agent by JetBrains. Compose Multiplatform shares its API with Jetpack Compose. As a result,
                LLMs are already well-trained, helping you generate UI components and complete screens faster than ever.
            </>
        ),
    },
    {
        id: 'hot-reload',
        title: 'Hot reload',
        text: (
            <>
                Tweak and preview your UI instantly without restarting on desktop with{' '}
                <span className={styles.mute}>Compose Hot Reload</span>, speeding up your development workflow.
            </>
        ),
    },
    {
        id: 'tooling',
        title: 'Seamless tooling',
        text: (
            <>
                Enjoy smart IDE support with the <span className={styles.mute}>KMP plugin</span> for{' '}
                <span className={styles.mute}>IntelliJ IDEA</span> and{' '}
                <span className={styles.mute}>Android Studio</span>↗, with common previews, cross-language navigation,
                refactorings, and debugging across Kotlin and Swift code.
            </>
        ),
    },
    {
        id: 'ecosystem',
        title: 'A thriving ecosystem',
        text: (
            <>
                Leverage a{' '}
                <span className={styles.mute}>rich set of production-ready Kotlin Multiplatform libraries</span>
                ↗, including <span className={styles.mute}>official multiplatform Jetpack libraries</span>↗. Join a
                growing community that’s shaping the future of cross-platform development.
            </>
        ),
    },
];
