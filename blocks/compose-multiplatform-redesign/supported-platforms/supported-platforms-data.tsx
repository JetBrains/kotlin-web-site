import React, { ReactNode } from 'react';

// Copy verbatim from the mock (.f2c/pages/compose-multiplatform-redesign/manifest.json, section 04-format-cards).
// One entry per paragraph as the dump groups them; the markup step regroups
// them into headings, leads and cards but never rewrites a character.
export const SUPPORTED_PLATFORMS_COPY: { id: string; text: ReactNode }[] = [
    { id: 'supported-platforms-1', text: 'Supported platforms' },
    { id: 'supported-platforms-2', text: 'Android' },
    { id: 'supported-platforms-3', text: 'Stable' },
    { id: 'supported-platforms-4', text: 'Modern Android development with Jetpack Compose plus the flexibility to share your UI across platforms.' },
    { id: 'supported-platforms-5', text: 'iOS' },
    { id: 'supported-platforms-6', text: 'Stable' },
    { id: 'supported-platforms-7', text: 'Bring Kotlin to iOS to build native apps with a familiar development experience and native performance.' },
    { id: 'supported-platforms-8', text: 'Desktop' },
    { id: 'supported-platforms-9', text: 'Stable' },
    { id: 'supported-platforms-10', text: 'Build powerful desktop apps for Windows, macOS, and Linux from one codebase.' },
    { id: 'supported-platforms-11', text: 'Web' },
    { id: 'supported-platforms-12', text: 'Beta' },
    { id: 'supported-platforms-13', text: 'Bring your Compose UI to the browser with Kotlin and WebAssembly.' }
];
