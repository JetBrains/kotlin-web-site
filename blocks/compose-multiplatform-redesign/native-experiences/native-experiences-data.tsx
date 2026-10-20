import React, { ReactNode } from 'react';

// Copy verbatim from the mock (.f2c/pages/compose-multiplatform-redesign/manifest.json, section 03-content).
// One entry per paragraph as the dump groups them; the markup step regroups
// them into headings, leads and cards but never rewrites a character.
export const NATIVE_EXPERIENCES_COPY: { id: string; text: ReactNode }[] = [
    { id: 'native-experiences-1', text: 'Native experiences' },
    { id: 'native-experiences-2', text: 'Feels like iOS because it is.' },
    { id: 'native-experiences-3', text: 'Need camera, maps or platform APIs?' },
    { id: 'native-experiences-4', text: 'Access native APIs whenever you need them.' },
    { id: 'native-experiences-5', text: 'Gradual adoption' },
    { id: 'native-experiences-6', text: 'Start small or go all in without extra work – Compose Multiplatform fits into your existing app, whether you’re sharing one component, one screen, or the entire UI. Keep your existing SwiftUI, Android Views, or Swing code – there’s no need to rewrite anything. Learn from the experience of other companies.' },
    { id: 'native-experiences-7', text: 'AI-powered code generation' },
    { id: 'native-experiences-8', text: 'Speed up your UI coding with code generation powered by Junie, the coding agent by JetBrains. Compose Multiplatform shares its API with Jetpack Compose. As a result, LLMs are already well-trained, helping you generate UI components and complete screens faster than ever.' },
    { id: 'native-experiences-9', text: 'Hot reload' },
    { id: 'native-experiences-10', text: 'Tweak and preview your UI instantly without restarting on desktop with Compose Hot Reload, speeding up your development workflow.' },
    { id: 'native-experiences-11', text: 'Seamless tooling' },
    { id: 'native-experiences-12', text: 'Enjoy smart IDE support with the KMP plugin for IntelliJ IDEA and Android Studio↗, with common previews, cross-language navigation, refactorings, and debugging across Kotlin and Swift code.' },
    { id: 'native-experiences-13', text: 'A thriving ecosystem' },
    { id: 'native-experiences-14', text: 'Leverage a rich set of production-ready Kotlin Multiplatform libraries↗, including official multiplatform Jetpack libraries↗. Join a growing community that’s shaping the future of cross-platform development.' }
];
