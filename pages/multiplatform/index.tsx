import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';

import { LandingLayout, LandingLayoutProps } from '../../components/landing-layout/landing-layout';
import {
    MULTIPLATFORM_MOBILE_TITLE,
    MULTIPLATFORM_MOBILE_URL
} from '@jetbrains/kotlin-web-site-ui/out/components/header';

import { FaqBlock } from '../../blocks/multiplatform/faq-block/faq-block';
import { ChooseToShare } from '../../blocks/multiplatform/choose-to-share';

const TOP_MENU_ITEMS: LandingLayoutProps['topMenuItems'] = [];

export default function MultiplatformLanding() {
    return (
        <LandingLayout
            dataTestId={'multiplatform-landing'}
            title={'Kotlin Multiplatform – Build Cross-Platform Apps'}
            ogImageName={'multiplatform.png'}
            description={'Kotlin Multiplatform is a technology for reusing up to 100% of your code across Android, iOS, web, and desktop, with Compose Multiplatform for shared UIs.'}
            currentTitle={MULTIPLATFORM_MOBILE_TITLE}
            currentUrl={MULTIPLATFORM_MOBILE_URL}
            topMenuTitle={MULTIPLATFORM_MOBILE_TITLE}
            topMenuHomeUrl={MULTIPLATFORM_MOBILE_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href={'#get-started'}>Get started</Button>}
            canonical={'https://kotlinlang.org/multiplatform/'}
        >
            <ThemeProvider theme={'dark'}>
                <FaqBlock />
                <ChooseToShare />
            </ThemeProvider>
        </LandingLayout>
    );
}
