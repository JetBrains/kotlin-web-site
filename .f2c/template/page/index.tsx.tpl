import React from 'react';
import cn from 'classnames';

import { LandingLayout } from '@/components/landing-layout/landing-layout';
{{sectionImports}}

import styles from './index.module.css';

// The blocks in the mock's order ({{pageRecord}}/manifest.json). The shell is
// the newest shipped landing's (pages/state-of-kotlin-2026, rules R1):
// LandingLayout carries header, meta and footer and takes the page's theme as
// a prop; the layout column is ktl-layout-v2; every block owns its vertical
// padding (rules R2) — nothing is spaced here. A new landing only: a redesign
// of a shipped page edits that page's route module and keeps its shell,
// topMenu* props, title and description (rules R1a).
export const PAGE_TITLE = {{pageTitle}};
export const PAGE_URL = '/{{route}}/';

function {{pageComponentName}}() {
    return (
        <LandingLayout
            title={PAGE_TITLE}
            description={{{pageDescription}}}
            theme="{{theme}}"
            hideTopMenu
            currentTitle={PAGE_TITLE}
            currentUrl={PAGE_URL}
            dataTestId="{{pageSlug}}-page"
        >
            <div className={styles.wrapper}>
                <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}>
{{sectionJsx}}
                </div>
            </div>
        </LandingLayout>
    );
}

export default {{pageComponentName}};
