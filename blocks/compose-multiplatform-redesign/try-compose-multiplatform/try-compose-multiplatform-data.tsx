import React, { ReactNode } from 'react';

// Copy verbatim from the mock (.f2c/pages/compose-multiplatform-redesign/manifest.json, section 05-showcase).
// One entry per paragraph as the dump groups them; the markup step regroups
// them into headings, leads and cards but never rewrites a character.
export const TRY_COMPOSE_MULTIPLATFORM_COPY: { id: string; text: ReactNode }[] = [
    { id: 'try-compose-multiplatform-1', text: 'Try Compose Multiplatform' },
    { id: 'try-compose-multiplatform-2', text: 'Run' }
];
