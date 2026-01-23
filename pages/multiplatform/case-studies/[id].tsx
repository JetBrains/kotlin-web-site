import React from 'react';
import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';

import { LandingLayout, LandingLayoutProps } from '../../../components/landing-layout/landing-layout';

import '@jetbrains/kotlin-web-site-ui/out/components/layout-v2';

const MULTIPLATFORM_MOBILE_TITLE = 'Kotlin Multiplatform' as const;
const MULTIPLATFORM_MOBILE_URL = '/multiplatform/' as const;

const TOP_MENU_ITEMS: LandingLayoutProps['topMenuItems'] = [
    {
        title: 'Compose Multiplatform',
        url: '/compose-multiplatform/'
    },
    {
        title: 'Success stories',
        url: '/case-studies/?type=multiplatform'
    },
];

const GET_STARTED_URL = '/docs/multiplatform/get-started.html' as const;

export default function MultiplatformCaseStudy() {
    return (
        <LandingLayout
            dataTestId={'multiplatform-case-study'}
            title={'Kotlin Multiplatform Case Study'}
            ogImageName={'multiplatform.png'}
            description={''}
            currentTitle={MULTIPLATFORM_MOBILE_TITLE}
            currentUrl={MULTIPLATFORM_MOBILE_URL}
            topMenuTitle={MULTIPLATFORM_MOBILE_TITLE}
            topMenuHomeUrl={MULTIPLATFORM_MOBILE_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href={GET_STARTED_URL}>Get started</Button>}
            canonical={'https://kotlinlang.org/multiplatform/case-studies/'}
        >
            <div className="ktl-layout-to-2">
                <ThemeProvider theme={'light'}>
                    content
                    {/* Content will be added here */}
                </ThemeProvider>
            </div>
        </LandingLayout>
    );
}
