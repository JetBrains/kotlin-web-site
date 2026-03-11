import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';

import { LandingLayout, LandingLayoutProps } from '../../components/landing-layout/landing-layout';

import '@jetbrains/kotlin-web-site-ui/out/components/layout-v2';

import { HeroBanner } from '../../blocks/multiplatform/hero';
import { ChooseShare } from '../../blocks/multiplatform/choose-share';
import { KMPApps } from '../../blocks/multiplatform/kmp-apps/kmp-apps';
import { FaqBlock } from '../../blocks/multiplatform/faq-block/faq-block';
import { CtaBlock } from '../../blocks/multiplatform/cta-block/cta-block';
import { CaseStudies } from '../../blocks/multiplatform/case-studies/grid';
import { CustomerLogos } from '../../blocks/multiplatform/case-studies/customers';
import { CoolVideos } from '../../blocks/multiplatform/videos/videos';

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
    {
        title: 'Libraries',
        url: 'https://klibs.io/'
    }
];

const GET_STARTED_URL = '/docs/multiplatform/get-started.html' as const;

export default function MultiplatformLanding() {
    return (
        <LandingLayout
            dataTestId={'multiplatform-landing'}
            title={'Kotlin Multiplatform – Build Cross-Platform Apps'}
            ogImageName={'multiplatform.png'}
            description={
                'Kotlin Multiplatform is a technology for reusing up to 100% of your code across Android, iOS, web, and desktop, with Compose Multiplatform for shared UIs.'
            }
            currentTitle={MULTIPLATFORM_MOBILE_TITLE}
            currentUrl={MULTIPLATFORM_MOBILE_URL}
            topMenuTitle={MULTIPLATFORM_MOBILE_TITLE}
            topMenuHomeUrl={MULTIPLATFORM_MOBILE_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href={GET_STARTED_URL}>Get started</Button>}
            canonical={'https://kotlinlang.org/multiplatform/'}
        >
            <div className="ktl-layout-to-2">
                <ThemeProvider theme={'dark'}>
                    <HeroBanner url={GET_STARTED_URL} />
                    <CustomerLogos />
                    <ChooseShare />
                    <CoolVideos />
                    <KMPApps />
                    <CaseStudies />
                    <FaqBlock />
                    <CtaBlock url={GET_STARTED_URL} />
                </ThemeProvider>
            </div>
        </LandingLayout>
    );
}
