import React, { ReactNode } from 'react';

// Copy verbatim from the mock (.f2c/pages/compose-multiplatform-redesign/manifest.json, section 08-showcase).
// One entry per paragraph as the dump groups them; the markup step regroups
// them into headings, leads and cards but never rewrites a character.
export const BUILD_YOUR_FIRST_COPY: { id: string; text: ReactNode }[] = [
    { id: 'build-your-first-1', text: 'Build your first app' },
    { id: 'build-your-first-2', text: 'Follow the guide to launch your first Compose Multiplatform app.' },
    { id: 'build-your-first-3', text: 'Get started' }
];
