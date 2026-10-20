import React from 'react';
import Head from 'next/head';
import cn from 'classnames';

import { LandingLayout } from '@/components/landing-layout/landing-layout';
import { TryComposeMultiplatformSection } from '@/blocks/compose-multiplatform-redesign/try-compose-multiplatform/try-compose-multiplatform';

import styles from '../../index.module.css';

// Section preview for the Figma-to-code pilot: the block alone under the
// page's shell, so a markup agent works and measures on its own route.
// Never indexed; deleted by finalize-project-page.mjs before the PR.
function TryComposeMultiplatformSectionPreview() {
    return (
        <LandingLayout title={'Compose Multiplatform | Kotlin AI Pages (KTL-5170 / KTL-4742)'} theme="dark" hideTopMenu dataTestId="compose-multiplatform-redesign-preview">
            <Head>
                <meta name="robots" content="noindex" />
            </Head>
            <div className={styles.wrapper}>
                <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}>
                    <TryComposeMultiplatformSection />
                </div>
            </div>
        </LandingLayout>
    );
}

export default TryComposeMultiplatformSectionPreview;
