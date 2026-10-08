import React from 'react';
import Head from 'next/head';
import cn from 'classnames';

import { LandingLayout } from '@/components/landing-layout/landing-layout';
import { {{sectionComponent}} } from '{{sectionImport}}';

import styles from '../../index.module.css';

// Section preview for the Figma-to-code pilot: the block alone under the
// page's shell, so a markup agent works and measures on its own route.
// Never indexed; deleted by finalize-project-page.mjs before the PR.
function {{sectionComponent}}Preview() {
    return (
        <LandingLayout title={{{pageTitle}}} theme="{{theme}}" hideTopMenu dataTestId="{{pageSlug}}-preview">
            <Head>
                <meta name="robots" content="noindex" />
            </Head>
            <div className={styles.wrapper}>
                <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}>
                    <{{sectionComponent}} />
                </div>
            </div>
        </LandingLayout>
    );
}

export default {{sectionComponent}}Preview;
