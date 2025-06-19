import React, { FC, useCallback, useMemo } from 'react';

import Head from 'next/head';

import GlobalHeader, { SERVER_SIDE_TITLE } from '@jetbrains/kotlin-web-site-ui/out/components/header';
import GlobalFooter from '@jetbrains/kotlin-web-site-ui/out/components/footer';
import TopMenu from '@jetbrains/kotlin-web-site-ui/out/components/top-menu';
import { ThemeProvider } from '@rescui/ui-contexts';
import { useRouter } from 'next/router';
import { StickyHeader } from '../../../components/sticky-header/sticky-header';
import styles from './server-side-layout.module.css';
import releasesDataRaw from '../../../data/releases.yml';
import searchConfig from '../../../search-config.json';
import { Button } from '@rescui/button';


const releasesData: ReleasesData = releasesDataRaw as ReleasesData;

const TOP_MENU_ITEMS = [
    {
        url: '/lp/server-side/case-studies/',
        title: 'Case Studies'
    },
];

interface CommunityLayoutProps {
    title: string;
    description?: string;
    ogImageName?: string;
    children: React.ReactNode;
}

export const ServerSideLayout: FC<CommunityLayoutProps> = ({ title, ogImageName, description, children }) => {
    const theme = 'dark';
    const router = useRouter();
    const pathname = addTrailingSlash(router.pathname);

    let items = TOP_MENU_ITEMS;

    let activeIndex = useMemo(
        () => items.map((item) => item.url).indexOf(pathname),
        [pathname, items]
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

            <ThemeProvider theme={theme}>

                <GlobalHeader
                    currentUrl={'COMMUNITY_URL'}
                    currentTitle={SERVER_SIDE_TITLE}
                    productWebUrl={releasesData.latest.url}
                    hasSearch={true}
                    searchConfig={searchConfig}
                />

                <StickyHeader>
                    <div className={styles.sticky}>
                        <TopMenu
                            className={styles.topMenu}
                            homeUrl={'COMMUNITY_URL'}
                            title={SERVER_SIDE_TITLE}
                            activeIndex={activeIndex}
                            items={items}
                            linkHandler={linkHandler}
                            mobileOverview={false}
                        >
                            <Button>Get started</Button>
                        </TopMenu>
                    </div>
                </StickyHeader>

                {children}

                <GlobalFooter />
            </ThemeProvider>
        </>
    );
};

function addTrailingSlash(path: string): string {
    return path.endsWith('/') ? path : `${path}/`;
}
