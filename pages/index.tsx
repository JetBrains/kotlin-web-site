import React from 'react';
import GlobalHeader from '@jetbrains/kotlin-web-site-ui/out/components/header';
import searchConfig from '../search-config.json';
import { CtaBlock } from '@jetbrains/kotlin-web-site-ui/out/components/cta-block-v2';
import { Button } from '@rescui/button';
import { useTS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints';

import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';
import '@jetbrains/kotlin-web-site-ui/out/components/layout';

import { KotlinUsageHighlights } from '../blocks/main/kotlin-usage-highlights/kotlin-usage-highlights';
import GlobalFooter from '@jetbrains/kotlin-web-site-ui/out/components/footer';
import { ThemeProvider } from '@rescui/ui-contexts';

import GradleLogo from '../public/images/companies/gradle.svg';
import CordaLogo from '../public/images/companies/corda.svg';
import EvernoteLogo from '../public/images/companies/evernote.svg';
import CourseraLogo from '../public/images/companies/coursera.svg';
import SpringLogo from '../public/images/companies/spring.svg';
import AtlassianLogo from '../public/images/companies/atlassian.svg';
import MultiplatformPreviewImage from '../public/images/index/multiplatform-preview.svg';

import { InfoBlock } from '../blocks/main/info-block/info-block';
import { DividerLine } from '../blocks/main/divider-line/divider-line';

import Link from 'next/link';

import styles from './index.module.css';

const kotlinUsageHighlightsCases = [
    {
        company: 'Gradle',
        url: 'https://blog.gradle.org/kotlin-meets-gradle',
        text: 'Gradle is introducing Kotlin as a language for writing build scripts',
        logo: GradleLogo
    },
    {
        company: 'Corda',
        url: 'https://www.corda.net/2017/01/10/kotlin/',
        text: 'Corda is an open-source distributed ledger platform, supported by major banks, and built entirely in Kotlin',
        logo: CordaLogo
    },
    {
        company: 'Evernote',
        url: 'https://blog.evernote.com/tech/2017/01/26/android-state-library/',
        text: 'Evernote recently integrated Kotlin into their Android client',
        logo: EvernoteLogo
    },
    {
        company: 'Coursera',
        url: 'https://building.coursera.org/blog/2016/03/16/becoming-bilingual-coursera/',
        text: 'Coursera Android app is partially written in Kotlin',
        logo: CourseraLogo
    },
    {
        company: 'Spring',
        url: 'https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0',
        text: 'Spring makes use of Kotlin\'s language features to offer more concise APIs',
        logo: SpringLogo
    },
    {
        company: 'Atlassian',
        url: 'https://twitter.com/danlew42/status/809065097339564032',
        text: 'All new code in the Trello Android app is in Kotlin',
        logo: AtlassianLogo
    }
];

function Index() {
    const isTS = useTS();

    return (
        <>
            <GlobalHeader productWebUrl={''} hasSearch={true} searchConfig={searchConfig} darkHeader />

            <div className={'ktl-layout ktl-layout--center'}>
                <InfoBlock
                    title={'Share code on your terms and for different platforms'}
                    text={
                        <>
                            Simplify the development of cross-platform projects with Kotlin Multiplatform.
                            It reduces time spent writing and maintaining the same code for different platforms while
                            retaining the flexibility and benefits of native programming.
                            Kotlin applications will work on different operating systems,
                            such as iOS, Android, macOS, Windows, Linux, watchOS, and others.
                        </>
                    }
                    button={
                        <Button href="/lp/multiplatform/" size="l" mode="rock" theme="light">
                            {isTS ? 'Learn more' : 'Learn about Kotlin Multiplatform' }
                        </Button>
                    }
                    media={<img src={MultiplatformPreviewImage.src}  alt="" />}
                />

                <DividerLine />

                <InfoBlock
                    title={'Big, friendly and helpful community'}
                    text={
                        <>
                            Kotlin has great support and many contributors in its fast-growing global community.
                            Enjoy the benefits of a rich ecosystem with a wide range of community libraries.
                            Help is never far away — consult extensive community resources or ask the Kotlin team directly.
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
                        <YoutubePlayer id="JGvk4M0Rfxo" className={styles.videoPlayer} />
                    }
                />

                <DividerLine />

                <KotlinUsageHighlights title="Kotlin usage highlights" items={kotlinUsageHighlightsCases} />
            </div>

            <CtaBlock
                className={styles.ctaBlock}
                mainTitle={
                    <>Start using{isTS && <br />} Kotlin today!</>
                }
                buttons={
                    <Button href="/docs/getting-started.html" size="l" mode="rock" theme="light">
                        Get started
                    </Button>
                }
            />

            <ThemeProvider theme={'dark'}>
                <GlobalFooter />
            </ThemeProvider>
        </>
    );
}

export default Index;
