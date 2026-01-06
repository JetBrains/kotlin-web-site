import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';

import { LandingLayout, LandingLayoutProps } from '../../components/landing-layout/landing-layout';

import '@jetbrains/kotlin-web-site-ui/out/components/layout-v2';
import { ComposeMultiplatformHero } from '../../blocks/compose-multiplatform/hero';
import CtaBlock from '../../blocks/compose-multiplatform/cta-block';
import QuoteSection from '../../blocks/compose-multiplatform/quote-section/quote-section';

const TOP_MENU_TITLE = 'Kotlin Multiplatform' as const;
const TOP_MENU_HOME_URL = '/multiplatform/' as const;
const COMPOSE_MULTIPLATFORM_URL = '/compose-multiplatform/' as const;

const TOP_MENU_ITEMS: LandingLayoutProps['topMenuItems'] = [
    {
        title: 'Compose Multiplatform',
        url: COMPOSE_MULTIPLATFORM_URL,
    },
    {
        title: 'Success stories',
        url: '/case-studies/?type=multiplatform&compose=true',
    },
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
            currentTitle={TOP_MENU_TITLE}
            currentUrl={COMPOSE_MULTIPLATFORM_URL}
            topMenuTitle={TOP_MENU_TITLE}
            topMenuHomeUrl={TOP_MENU_HOME_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href={GET_STARTED_URL}>Get started</Button>}
            canonical={'https://kotlinlang.org/compose-multiplatform/'}
        >
            <div className="ktl-layout-to-2">
                <ThemeProvider theme={'dark'}>
                    <ComposeMultiplatformHero />
                    <QuoteSection />
                    <CtaBlock />
                </ThemeProvider>
            </div>
        </LandingLayout>
    );
}
