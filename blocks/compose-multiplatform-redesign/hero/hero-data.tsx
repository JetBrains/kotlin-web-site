import React, { ReactNode } from 'react';

// Copy verbatim from the mock (.f2c/pages/compose-multiplatform-redesign/manifest.json, section 01-hero).
// One entry per paragraph as the dump groups them; the markup step regroups
// them into headings, leads and cards but never rewrites a character.
export const HERO_COPY: { id: string; text: ReactNode }[] = [
    { id: 'hero-1', text: 'Compose' },
    { id: 'hero-2', text: 'Multiplatform' },
    { id: 'hero-3', text: 'Build beautiful shared UIs for Android, iOS, desktop, and web that feel natural on every platform.' },
    { id: 'hero-4', text: 'Android' },
    { id: 'hero-5', text: 'iOS' },
    { id: 'hero-6', text: 'Web' },
    { id: 'hero-7', text: 'Desktop' },
    { id: 'hero-8', text: 'Get started' },
    { id: 'hero-9', text: '​' },
    { id: 'hero-10', text: 'Markaz, Pakistan’s e-commerce platform with 5M+ downloads, has 100+ screens built entirely with Compose Multiplatform.' },
    { id: 'hero-11', text: '​' }
];
