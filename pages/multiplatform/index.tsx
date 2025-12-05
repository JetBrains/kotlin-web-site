import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';
import { useTextStyles } from '@rescui/typography';

import { LandingLayout, LandingLayoutProps } from '../../components/landing-layout/landing-layout';

import '@jetbrains/kotlin-web-site-ui/out/components/layout-v2';

import { HeroBanner } from '../../blocks/multiplatform/hero';
import { ChooseShare } from '../../blocks/multiplatform/choose-share';
import { VideoBlock } from '../../blocks/multiplatform/video-block/video-block';
import { HighlightedBg } from '../../blocks/multiplatform/highlighted-bg/highlighted-bg';
import { FaqBlock } from '../../blocks/multiplatform/faq-block/faq-block';
import { CtaBlock } from '../../blocks/multiplatform/cta-block/cta-block';
import { CaseStudies } from '../../blocks/multiplatform/case-studies/grid';
import { CustomerLogos } from '../../blocks/multiplatform/case-studies/customers';

const MULTIPLATFORM_MOBILE_TITLE = 'Kotlin Multiplatform' as const;
const MULTIPLATFORM_MOBILE_URL = '/multiplatform/' as const;

const TOP_MENU_ITEMS: LandingLayoutProps['topMenuItems'] = [
    {
        title: 'Compose Multiplatform',
        url: 'https://www.jetbrains.com/compose-multiplatform/'
    },
    {
        title: 'Docs',
        url: 'https://kotlinlang.org/docs/multiplatform/get-started.html'
    }
];

const GET_STARTED_URL = '/docs/multiplatform/get-started.html' as const;

export default function MultiplatformLanding() {
    const textCn = useTextStyles();
    const linkClass = textCn('rs-link');

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
                    <HighlightedBg>
                        <VideoBlock
                            title={'AI-powered code generation'}
                            videoURL={'https://resources.jetbrains.com/storage/products/kotlin/landings/kmp_and_junie.mp4'}
                            iconPath={'/images/multiplatform/video-block/junie.svg'}
                            textWidthLimit={'917px'}
                        >
                            <>
                                Speed up your multiplatform coding with code generation powered by{' '}
                                <a className={linkClass} href={'https://www.jetbrains.com/junie/'}>Junie</a>, the coding agent by JetBrains.
                            </>
                        </VideoBlock>

                        <VideoBlock
                            title={'Seamless tooling'}
                            videoURL={'https://resources.jetbrains.com/storage/products/kotlin/landings/kmp_compose_hot_reload.mp4'}
                            iconPath={'/images/multiplatform/video-block/infinity.svg'}
                            textWidthLimit={'993px'}
                        >
                            <>
                                Enjoy smart IDE support with the{' '}
                                <a className={linkClass} href={'https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform'}>KMP plugin</a>{' '}for{' '}
                                <a className={linkClass} href={'https://www.jetbrains.com/idea/download/'}>IntelliJ IDEA</a>{' '}and{' '}
                                <a className={linkClass} href={'https://developer.android.com/studio'}>Android Studio</a>, with common previews,
                                cross-language navigation, refactorings, and debugging across Kotlin and Swift code.
                            </>
                        </VideoBlock>
                    </HighlightedBg>
                    <CaseStudies />
                    <FaqBlock />
                    <CtaBlock url={GET_STARTED_URL} />
                </ThemeProvider>
            </div>
        </LandingLayout>
    );
}
