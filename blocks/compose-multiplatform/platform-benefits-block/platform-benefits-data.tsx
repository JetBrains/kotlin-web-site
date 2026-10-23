import { ReactNode } from 'react';
import { createTextCn } from '@rescui/typography';

const textCn = createTextCn('dark');

const linkCn = textCn('rs-link', { hardness: 'average' });
const externalLinkCn = textCn('rs-link', { hardness: 'average', external: true });

export const NATIVE_FEATURES = ['Native scrolling', 'Native gestures', 'Native text editing', 'Native performance'];

export type FeatureCard = {
    id: string;
    title: string;
    text: ReactNode;
};

export const FEATURE_CARDS: FeatureCard[] = [
    {
        id: 'ai',
        title: 'AI-powered code generation',
        text: (
            <>
                Speed up your UI coding with coding agents. Compose Multiplatform shares its API with Jetpack Compose. As
                a result, LLMs are already well-trained, helping you generate UI components and complete screens faster
                than ever.
            </>
        ),
    },
    {
        id: 'hot-reload',
        title: 'Hot reload',
        text: (
            <>
                Tweak and preview your UI instantly without restarting on desktop with{' '}
                <a href="/docs/multiplatform/compose-hot-reload.html" className={linkCn}>
                    Compose Hot Reload
                </a>
                , speeding up your development workflow.
            </>
        ),
    },
    {
        id: 'tooling',
        title: 'Seamless tooling',
        text: (
            <>
                The{' '}
                <a href="/docs/multiplatform/kotlin-toolchain.html" className={linkCn}>
                    Kotlin Toolchain
                </a>{' '}
                simplifies project setup, building, running, and testing across platforms for you and your coding
                agent. The{' '}
                <a href="https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform" className={linkCn}>
                    Kotlin Multiplatform plugin
                </a>{' '}
                for{' '}
                <a href="https://www.jetbrains.com/idea/download/" className={linkCn}>
                    IntelliJ IDEA
                </a>{' '}
                and{' '}
                <a
                    href="https://developer.android.com/studio/"
                    className={externalLinkCn}
                    target="_blank"
                    rel="noreferrer"
                >
                    Android Studio
                </a>{' '}
                provides smart IDE support.
            </>
        ),
    },
    {
        id: 'ecosystem',
        title: 'A thriving ecosystem',
        text: (
            <>
                Leverage a{' '}
                <a href="https://klibs.io/" className={externalLinkCn} target="_blank" rel="noreferrer">
                    rich set of production-ready Kotlin Multiplatform libraries
                </a>
                , including{' '}
                <a
                    href="https://developer.android.com/kotlin/multiplatform"
                    className={externalLinkCn}
                    target="_blank"
                    rel="noreferrer"
                >
                    official multiplatform Jetpack libraries
                </a>
                . Join a growing community that’s shaping the future of cross-platform development.
            </>
        ),
    },
];
