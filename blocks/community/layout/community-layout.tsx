import React, { FC, useCallback, useMemo, useState } from 'react';

import Head from 'next/head';

import GlobalHeader, { COMMUNITY_TITLE, COMMUNITY_URL } from '@jetbrains/kotlin-web-site-ui/out/components/header';
import GlobalFooter from '@jetbrains/kotlin-web-site-ui/out/components/footer';
import TopMenu from '@jetbrains/kotlin-web-site-ui/out/components/top-menu';
import { CtaBlock } from '@jetbrains/kotlin-web-site-ui/out/components/cta-block-v2';
import Button from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';
import { useRouter } from 'next/router';
import { StickyHeader } from '../../../components/sticky-header/sticky-header';
import styles from "./community-layout.module.css";
import releasesDataRaw from '../../../data/releases.yml';
import searchConfig from '../../../search-config.json';
import {CommunityAddEvent} from "../event-list/event-list";

const releasesData: ReleasesData = releasesDataRaw as ReleasesData;

const items = [
    {
        url: '/community/',
        title: 'Overview',
    },
    {
        url: '/community/user-groups/',
        title: 'Kotlin User Groups',
    },
    {
        url: '/community/events/',
        title: 'Events',
    },
];

interface CommunityLayoutProps {
    title: string;
    description?: string;
    ogImageName?: string;
    children: React.ReactNode;
}

export const CommunityLayout: FC<CommunityLayoutProps> = ({ title, ogImageName, description, children }) => {
    const theme = 'dark';
    const router = useRouter();
    const pathname = addTrailingSlash(router.pathname);
    const activeIndex = useMemo(
        () => items.map((item) => item.url).indexOf(pathname),
        [router.pathname]
    );
    const linkHandler = useCallback(
        (event, url) => {
            event.preventDefault();
            router.push(url);
        },
        [router]
    );

    const ogImagePath = useMemo(
        () => `https://kotlinlang.org/assets/images/open-graph/${ogImageName ? ogImageName : 'general.png'}`,
        [ogImageName]
    );

    const ogImageTwitterPath = useMemo(
        () => (ogImageName ? ogImagePath : 'https://kotlinlang.org/assets/images/twitter/general.png'),
        [ogImageName, ogImagePath]
    );

    return (
        <>
            <Head>
                <title>{title}</title>

                <meta property="og:title" content={title} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={'https://kotlinlang.org' + router.pathname} />

                <meta property="og:image" content={ogImagePath} />

                {description && <meta property="og:description" content={description} />}
                <meta property="og:site_name" content="Kotlin" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@kotlin" />
                <meta name="twitter:title" content={title} />
                {description && <meta name="twitter:description" content={description} />}
                <meta name="twitter:image:src" content={ogImageTwitterPath} />
            </Head>

            <GlobalHeader
                currentUrl={COMMUNITY_URL}
                currentTitle={COMMUNITY_TITLE}
                productWebUrl={releasesData.latest.url}
                hasSearch={true}
                searchConfig={searchConfig}
            />

            <StickyHeader>
                <div className={styles.sticky}>
                    <TopMenu
                        className={styles.topMenu}
                        homeUrl={COMMUNITY_URL}
                        title={COMMUNITY_TITLE}
                        activeIndex={activeIndex}
                        items={items}
                        linkHandler={linkHandler}
                        mobileOverview={false}
                    >
                        {pathname === '/community/events/' && (
                            <CommunityAddEvent
                                className={styles.add}
                                size="s"
                                href="https://github.com/JetBrains/kotlin-web-site/blob/master/README.md#community-events"
                            />
                        )}
                    </TopMenu>
                </div>
            </StickyHeader>

            {children}

            <CtaBlock
                topTitle={'Help us improve'}
                buttons={
                    <Button size="l" mode="rock" href="mailto:kug@jetbrains.com">
                        Write to us
                    </Button>
                }
                mainTitle={
                <>
                    Give us your feedback or ask any questions
                    <br />
                    you have about the Kotlin community
                </>
                }
            />


            <ThemeProvider theme={theme}>
                <GlobalFooter />
            </ThemeProvider>
        </>
    );
};

function addTrailingSlash(path: string): string {
    return path.endsWith('/') ? path : `${path}/`;
}
