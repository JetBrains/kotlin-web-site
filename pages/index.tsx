import React from 'react';
import GlobalHeader from '@jetbrains/kotlin-web-site-ui/out/components/header';
import searchConfig from '../search-config.json';
import '@jetbrains/kotlin-web-site-ui/out/components/layout';

import { KotlinUsageHighlights } from '../blocks/main/kotlin-usage-highlights/kotlin-usage-highlights';

import GradleLogo from '../public/images/companies/gradle.svg';
import CordaLogo from '../public/images/companies/corda.svg';
import EvernoteLogo from '../public/images/companies/evernote.svg';
import CourseraLogo from '../public/images/companies/coursera.svg';
import SpringLogo from '../public/images/companies/spring.svg';
import AtlassianLogo from '../public/images/companies/atlassian.svg';


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
    return (
        <>
            <GlobalHeader productWebUrl={''} hasSearch={true} searchConfig={searchConfig} darkHeader />

            <div className={'ktl-layout ktl-layout--center'}>
                <KotlinUsageHighlights title="Kotlin usage highlights" items={kotlinUsageHighlightsCases} />
            </div>
        </>
    );
}

export default Index;
