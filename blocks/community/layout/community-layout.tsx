import React, { FC, useCallback, useMemo, useState } from 'react';

import Head from 'next/head';

import GlobalHeader, { COMMUNITY_TITLE, COMMUNITY_URL } from '@jetbrains/kotlin-web-site-ui/out/components/header';
import GlobalFooter from '@jetbrains/kotlin-web-site-ui/out/components/footer';
import TopMenu from '@jetbrains/kotlin-web-site-ui/out/components/top-menu';
import CtaBlock from '@jetbrains/kotlin-web-site-ui/out/components/cta-block';
import Button from '@rescui/button';
import { Theme, ThemeProvider } from '@rescui/ui-contexts';
import { useRouter } from 'next/router';
import { StickyHeader } from '../../../components/sticky-header/sticky-header';
import { Favicon } from '../../../components/favicon/favicon';
import { Search, onSearch } from '../../../components/search/search';
import releasesDataRaw from '../../../data/releases.yml';

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
    children: React.ReactNode;
}

export const CommunityLayout: FC<CommunityLayoutProps> = ({ title, children }) => {
    const [theme, setTheme] = useState<Theme>('dark');
    const router = useRouter();
    const activeIndex = useMemo(
        () => items.map((item) => item.url).indexOf(addTrailingSlash(router.pathname)),
        [router.pathname]
    );
    const linkHandler = useCallback(
        (event, url) => {
            event.preventDefault();
            router.push(url);
        },
        [router]
    );

    return (
        <>
            <Head>
                <title>{title}</title>
                <Favicon />
                <meta name="viewport" content="width=device-width" />
            </Head>

            <GlobalHeader
                currentUrl={COMMUNITY_URL}
                currentTitle={COMMUNITY_TITLE}
                productWebUrl={releasesData.latest.url}
                hasSearch={true}
                onSearchClick={onSearch}
            />

            <StickyHeader>
                <TopMenu
                    homeUrl={COMMUNITY_URL}
                    title={COMMUNITY_TITLE}
                    activeIndex={activeIndex}
                    items={items}
                    linkHandler={linkHandler}
                    mobileOverview={false}
                />
            </StickyHeader>

            {children}

            <CtaBlock
                topTitle={'Help us improve'}
                buttons={
                    <Button size="l" mode="rock" href="mailto:kug@jetbrains.com">
                        Write to us
                    </Button>
                }
            >
                <div className={'ktl-hero ktl-hero_theme_dark'}>
                    Give us your feedback or ask any questions
                    <br />
                    you have about the Kotlin community
                </div>
            </CtaBlock>

            <ThemeProvider theme={theme}>
                <GlobalFooter />
            </ThemeProvider>

            <Search />
        </>
    );
};

function addTrailingSlash(path: string): string {
    return path.endsWith('/') ? path : `${path}/`;
}
