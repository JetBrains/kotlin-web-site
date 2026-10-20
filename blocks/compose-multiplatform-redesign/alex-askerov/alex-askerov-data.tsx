import React, { ReactNode } from 'react';

// Copy verbatim from the mock (.f2c/pages/compose-multiplatform-redesign/manifest.json, section 06-content).
// One entry per paragraph as the dump groups them; the markup step regroups
// them into headings, leads and cards but never rewrites a character.
export const ALEX_ASKEROV_COPY: { id: string; text: ReactNode }[] = [
    { id: 'alex-askerov-1', text: 'Alex Askerov' },
    { id: 'alex-askerov-2', text: 'Mobile Development Unit Lead at Wrike' },
    { id: 'alex-askerov-3', text: 'Building on our success with Kotlin Multiplatform integration, we’ve decided to go ahead with Compose Multiplatform for building Calendar View. In less than three months, it was live on the App Store and Google Play.' },
    { id: 'alex-askerov-4', text: 'Most of the client logic was implemented by a single Android developer. From the iOS side, only integration was required. Compose Multiplatform was even smoother [than KMP] to integrate, requiring minimal work from iOS developers.' },
    { id: 'alex-askerov-5', text: '1/4' }
];
