import React, { ReactNode } from 'react';

// Copy verbatim from the mock ({{pageRecord}}/manifest.json, section {{sectionKey}}).
// One entry per paragraph as the dump groups them; the markup step regroups
// them into headings, leads and cards but never rewrites a character.
export const {{copyConst}}: { id: string; text: ReactNode }[] = [
{{copyLines}}
];
