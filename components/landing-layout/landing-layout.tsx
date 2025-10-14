import React, { FC, useCallback, useMemo } from 'react';

import Head from 'next/head';

import GlobalHeader from '@jetbrains/kotlin-web-site-ui/out/components/header';
import GlobalFooter from '@jetbrains/kotlin-web-site-ui/out/components/footer';
import TopMenu from '@jetbrains/kotlin-web-site-ui/out/components/top-menu';
import { ThemeProvider } from '@rescui/ui-contexts';
import { useRouter } from 'next/router';
import styles from './landing-layout.module.css';
import releasesDataRaw from '../../data/releases.yml';
import searchConfig from '../../search-config.json';
import { StickyHeader } from '../sticky-header/sticky-header';


const releasesData: ReleasesData = releasesDataRaw as ReleasesData;

type NavigationProps = {
    topMenuItems?: { url: string; title: string }[];
    topMenuButton?: React.ReactNode;
    topMenuTitle?: string;
    topMenuHomeUrl?: string;
    currentUrl?: string;
    currentTitle?: string;
}

type LandingLayoutProps = {
    title: string;
    description?: string;
    ogImageName?: string;
    children: React.ReactNode;
    dataTestId?: string;
} & NavigationProps;

export const LandingLayout: FC<LandingLayoutProps> = ({ title, ogImageName, description, children, dataTestId, ...navigationProps }) => {
    const theme = 'dark';
    const router = useRouter();
    const pathname = addTrailingSlash(router.pathname);

    let items = navigationProps.topMenuItems || [];

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

                {description && <meta name="description" content={description} />}

                <meta property="og:image" content={ogImagePath} />

                {description && <meta property="og:description" content={description} />}
                <meta property="og:site_name" content="Kotlin" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@kotlin" />
                <meta name="twitter:title" content={title} />
                {description && <meta name="twitter:description" content={description} />}
                <meta name="twitter:image:src" content={ogImageTwitterPath} />
                <link rel="canonical" href={'https://kotlinlang.org/server-side/'} />
            </Head>

            <ThemeProvider theme={theme}>

                <GlobalHeader
                    currentUrl={navigationProps.currentUrl}
                    currentTitle={navigationProps.currentUrl}
                    productWebUrl={releasesData.latest.url}
                    hasSearch={true}
                    searchConfig={searchConfig}
                    hasBorder={false}
                />

                <StickyHeader>
                    <div className={styles.sticky}>
                        <TopMenu
                            className={styles.topMenu}
                            homeUrl={navigationProps.topMenuHomeUrl}
                            title={navigationProps.topMenuTitle}
                            activeIndex={activeIndex}
                            items={items}
                            linkHandler={linkHandler}
                            mobileOverview={true}
                        >
                            {navigationProps.topMenuButton}
                        </TopMenu>
                    </div>
                </StickyHeader>

                <div className={styles.contentWrapper} data-testid={dataTestId}>
                    {children}
                </div>

                <GlobalFooter />
            </ThemeProvider>
        </>
    );
};

function addTrailingSlash(path: string): string {
    return path.endsWith('/') ? path : `${path}/`;
}
