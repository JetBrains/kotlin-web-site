import React from 'react';

import Link from 'next/link';

import { ThemeProvider } from '@rescui/ui-contexts';
import { Button } from '@rescui/button';

import { useTS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints';
import '@jetbrains/kotlin-web-site-ui/out/components/layout';

import GlobalHeader from '@jetbrains/kotlin-web-site-ui/out/components/header';
import { CtaBlock } from '@jetbrains/kotlin-web-site-ui/out/components/cta-block-v2';
import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';
import GlobalFooter from '@jetbrains/kotlin-web-site-ui/out/components/footer';

import { Layout } from '../components/layout/layout';

import { HeroSection } from '../blocks/main/hero/hero';
import { LatestNews } from '../blocks/main/latest-news';
import { KotlinUsageHighlights } from '../blocks/main/kotlin-usage-highlights/kotlin-usage-highlights';
import { InfoBlock } from '../blocks/main/info-block/info-block';
import { DividerLine } from '../blocks/main/divider-line/divider-line';
import { FoundationLearnMoreButton, FoundationPreview } from '../blocks/main/foundation-preview/foundation-preview';
import { WhyKotlin } from '../blocks/main/why-kotlin/why-kotlin';

import { StickyHeader } from '../components/sticky-header/sticky-header';

import MultiplatformPreviewImage from '../public/images/main/multiplatform-preview.svg';

import GradleLogo from '../public/images/companies/gradle.svg';
import UberLogo from '../public/images/companies/uber.svg';
import AtlassianLogo from '../public/images/companies/atlassian.svg';
import GoogleLogo from '../public/images/companies/google.svg';
import JetbrainsLogoSquare from '../public/images/companies/jetbrains-logo-square.svg';
import ShopifyLogo from '../public/images/companies/shopify.svg';
import TouchlabLogo from '../public/images/companies/touchlab.svg';
import KotzillaLogo from '../public/images/companies/kotzilla-logo.svg'

import McDonaldsLogo from '../public/images/companies/mcdonalds.svg';
import AWSLogo from '../public/images/companies/aws.svg';
import PhilipsLogo from '../public/images/companies/philips.svg';
import AdobeLogo from '../public/images/companies/adobe.svg';
import ForbesLogo from '../public/images/companies/forbes.svg';

import styles from './index.module.css';

import searchConfig from '../search-config.json';


import releasesDataRaw from '../data/releases.yml';
import Script from 'next/script';

const releasesData: ReleasesData = releasesDataRaw as ReleasesData;

const kotlinUsageHighlightsCases = [
    {
        company: 'McDonald\'s',
        url: 'https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc',
        text: 'McDonald\'s leverages Kotlin Multiplatform (KMP) for their global mobile app, enabling them to build a codebase that can be shared across platforms, removing the need for codebase redundancies.',
        tag: 'Kotlin Multiplatform',
        logo: McDonaldsLogo
    },
    {
        company: 'AWS',
        url: 'https://talkingkotlin.com/qldb/',
        text: 'AWS opted for Kotlin over Java for Amazon Quantum Ledger Database (QLDB) thanks to its expressiveness and structured concurrency. They rewrote QLDB in Kotlin, enhancing the user experience, benefiting from its development workflow, and adopting it fully for server-side development.',
        tag: 'Server-side',
        logo: AWSLogo
    },
    {
        company: 'Philips',
        url: 'https://www.youtube.com/watch?v=hZPL8QqiLi8&ab_channel=Touchlab',
        text: 'Philips utilizes Kotlin Multiplatform in its HealthSuite digital platform mobile SDK. With KMP, they accelerated the implementation of new features and fostered increased collaboration between Android and iOS developers.',
        tag: 'Kotlin Multiplatform',
        logo: PhilipsLogo
    },
    {
        company: 'Adobe',
        url: 'https://blog.developer.adobe.com/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a',
        text: 'Adobe Experience Platform chose Kotlin for server-side development because of its concise syntax, async capabilities, and interoperability with Java. This shift boosted productivity and improved the developer experience, replacing Java for real-time services.',
        tag: 'Server-side',
        logo: AdobeLogo
    },
    {
        company: 'Forbes',
        url: 'https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/',
        text: 'By sharing over 80% of logic across iOS and Android, Forbes now rolls out new features simultaneously on both platforms, keeping the flexibility to withhold or customize features based on the specific platform.',
        tag: 'Kotlin Multiplatform',
        logo: ForbesLogo
    },
    {
        company: 'Atlassian',
        url: 'https://www.youtube.com/watch?v=4GkoB4hZUnw',
        text: 'Atlassian adopted Kotlin for the Jira Software cloud, leveraging its Java compatibility for seamless integration and minimizing migration challenges. Kotlin\'s ease of use improved developer productivity and boosted team satisfaction and efficiency.',
        tag: 'Server-side',
        logo: AtlassianLogo
    }
];

const kotlinFoundationCompanies = [
    {
        name: 'JetBrains',
        logo: JetbrainsLogoSquare,
        link: 'https://www.jetbrains.com/'
    },
    {
        name: 'Google',
        logo: GoogleLogo,
        link: 'https://about.google/'
    },
    {
        name: 'Gradle',
        logo: GradleLogo,
        link: 'https://gradle.org/'
    },
    {
        name: 'Uber',
        logo: UberLogo,
        link: 'https://www.uber.com/'
    },
    {
        name: 'Shopify',
        logo: ShopifyLogo,
        link: 'https://shopify.engineering/'
    },
    {
        name: 'Touchlab',
        logo: TouchlabLogo,
        link: 'https://touchlab.co/'
    },
    {
        name: 'Kotzilla',
        logo: KotzillaLogo,
        link: 'https://kotzilla.io/'
    },

];

export async function getStaticProps() {
    return { props: { isDarkTheme: true } };
}

function Index() {
    const isTS = useTS();

    return (
        <Layout
            title={'Kotlin Programming Language'}
            ogImageName={'general.png'}
            description={
                'Kotlin is a programming language that makes coding concise, cross-platform, and fun. It is Google’s preferred language for Android app development.'
            }
        >
            <ThemeProvider theme="dark">
                <StickyHeader>
                    <GlobalHeader
                        productWebUrl={releasesData.latest.url}
                        hasSearch={true}
                        searchConfig={searchConfig}
                        darkHeader
                    ></GlobalHeader>
                </StickyHeader>

                <HeroSection title={'Kotlin'}>
                    Concise. Multiplatform. Fun.
                </HeroSection>
                <div className={'ktl-layout ktl-layout--center'}>
                    <LatestNews />
                </div>
                <WhyKotlin />
            </ThemeProvider>

            <ThemeProvider theme="light">
                <div className={styles.evenSection}>
                    <div className={'ktl-layout ktl-layout--center'}>

                        <KotlinUsageHighlights title="Kotlin in action" items={kotlinUsageHighlightsCases} />

                        <DividerLine />

                        <InfoBlock
                            title={<>Share code on&nbsp;your terms and&nbsp;for different platforms</>}
                            text={
                                <>
                                    Simplify the development of cross-platform projects with Kotlin Multiplatform. It
                                    reduces time spent writing and maintaining the same code for different platforms
                                    while retaining the flexibility and benefits of native programming. Kotlin
                                    applications will work on different operating systems, such as iOS, Android, macOS,
                                    Windows, Linux, watchOS, and others.
                                </>
                            }
                            button={
                                <Button href="/lp/multiplatform/" size="l" mode="rock" theme="light">
                                    {isTS ? 'Learn more' : 'Learn about Kotlin Multiplatform'}
                                </Button>
                            }
                            media={<img src={MultiplatformPreviewImage.src} alt="" />}
                        />

                        <DividerLine />

                        <InfoBlock
                            title={'Big, friendly and helpful community'}
                            text={
                                <>
                                    Kotlin has great support and many contributors in its fast-growing global community.
                                    Enjoy the benefits of a rich ecosystem with a wide range of community libraries.
                                    Help is never far away — consult extensive community resources or ask the Kotlin
                                    team directly.
                                </>
                            }
                            button={
                                <Link href={'community'}>
                                    <Button size="l" mode="rock" theme="light">
                                        Join the community
                                    </Button>
                                </Link>
                            }
                            media={
                                <div className={styles.videoWrapper}>
                                    <YoutubePlayer playButtonMode={3} id="JGvk4M0Rfxo" className={styles.videoPlayer} />
                                </div>
                            }
                        />

                        <DividerLine />

                        <FoundationPreview
                            title={'Kotlin Foundation'}
                            description={'Actively supports community efforts in developing the Kotlin ecosystem.'}
                            button={<FoundationLearnMoreButton />}
                            companies={kotlinFoundationCompanies}
                        />
                    </div>

                    <CtaBlock
                        className={styles.ctaBlock}
                        mainTitle={<>Start using{isTS && <br />} Kotlin today!</>}
                        buttons={
                            <Button href="/docs/getting-started.html" size="l" mode="rock" theme="light">
                                Get started
                            </Button>
                        }
                    />
                </div>
            </ThemeProvider>

            <ThemeProvider theme={'dark'}>
                <GlobalFooter />
            </ThemeProvider>

            <Script src={'https://cdn.optimizely.com/js/26633200186.js'} strategy={"beforeInteractive"}/>
        </Layout>
    );
}

export default Index;
