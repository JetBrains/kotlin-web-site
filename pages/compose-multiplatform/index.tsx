import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';

import { LandingLayout, LandingLayoutProps } from '../../components/landing-layout/landing-layout';

import '@jetbrains/kotlin-web-site-ui/out/components/layout-v2';
import { ComposeMultiplatformHero } from '../../blocks/compose-multiplatform/hero';

const KOTLIN_MULTIPLATFORM_MOBILE_TITLE = 'Kotlin Multiplatform' as const;
const KOTLIN_MULTIPLATFORM_MOBILE_URL = '/multiplatform/' as const;

const TOP_MENU_ITEMS: LandingLayoutProps['topMenuItems'] = [
    {
        title: 'Compose Multiplatform',
        url: '/compose-multiplatform/'
    },
    {
        title: 'Success stories',
        url: '/case-studies/?type=multiplatform&compose=true'
    }
];

const GET_STARTED_URL = '/docs/multiplatform/compose-multiplatform-create-first-app.html' as const;

export default function ComposeMultiplatformLanding() {
    return (
        <LandingLayout
            dataTestId="compose-multiplatform-landing"
            title={'Compose Multiplatform – Beautiful UIs Everywhere'}
            ogImageName={'compose-multiplatform.png'}
            description={
                'Compose Multiplatform is a declarative framework for building beautiful shared UIs across Android, iOS, desktop, and web – powered by Kotlin Multiplatform.'
            }
            currentTitle={KOTLIN_MULTIPLATFORM_MOBILE_TITLE}
            currentUrl={KOTLIN_MULTIPLATFORM_MOBILE_URL}
            topMenuTitle={KOTLIN_MULTIPLATFORM_MOBILE_TITLE}
            topMenuHomeUrl={KOTLIN_MULTIPLATFORM_MOBILE_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href={GET_STARTED_URL}>Get started</Button>}
            canonical={'https://kotlinlang.org/compose-multiplatform/'}
        >
            <div className="ktl-layout-to-2">
                <ThemeProvider theme={'dark'}>
                    <ComposeMultiplatformHero />
                </ThemeProvider>
            </div>
        </LandingLayout>
    );
}
