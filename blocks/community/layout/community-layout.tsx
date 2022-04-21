import React, {FC, useCallback, useMemo, useState} from "react";

import Head from "next/head";

import GlobalHeader, {COMMUNITY_TITLE, COMMUNITY_URL} from '@jetbrains/kotlin-web-site-ui/out/components/header';
import GlobalFooter from '@jetbrains/kotlin-web-site-ui/out/components/footer';
import TopMenu from '@jetbrains/kotlin-web-site-ui/out/components/top-menu';
import CtaBlock from '@jetbrains/kotlin-web-site-ui/out/components/cta-block';
import Button from "@rescui/button";
import {Theme, ThemeProvider } from "@rescui/ui-contexts";
import { useRouter } from "next/router";
import {Favicon} from "../../../components/favicon/favicon";

const items = [
    {
        url: '/community',
        title: 'Overview',
    },
    {
        url: '/community/user-groups',
        title: 'Kotlin User Groups',
    },
    {
        url: '/community/events',
        title: 'Events',
    },
];

interface CommunityLayoutProps {
    title: string;
    children: React.ReactNode;
}

export const CommunityLayout: FC<CommunityLayoutProps> = ({title, children}) => {
    const [theme, setTheme] = useState<Theme>('dark');
    const router = useRouter();
    const activeIndex = useMemo(() => items.map(item => item.url).indexOf(router.pathname), [router.pathname]);
    const linkHandler = useCallback((event, url) => {
        event.preventDefault();
        router.push(url);
    }, []);

    return (
        <>
            <Head>
                <title>{title}</title>
                <Favicon />
                <meta name="viewport" content="viewport-fit=cover" />
            </Head>

            <GlobalHeader
                currentUrl={COMMUNITY_URL}
                currentTitle={COMMUNITY_TITLE}
                productWebUrl={''}
                hasSearch={true}
                onSearchClick={() => {}}
            />

            <TopMenu
                homeUrl={COMMUNITY_URL}
                title={COMMUNITY_TITLE}
                activeIndex={activeIndex}
                items={items}
                linkHandler={linkHandler}
            />

            {children}

            <CtaBlock
                topTitle={"Help us improve"}
                buttons={
                    <Button size="l" mode="rock" href="mailto:kug@jetbrains.com">Write to us</Button>
                }
            >
                <div className={"ktl-hero ktl-hero_theme_dark"}>Give us your feedback or ask any questions<br/>
                    you have about the Kotlin community
                </div>
            </CtaBlock>

            <ThemeProvider theme={theme}>
                <GlobalFooter/>
            </ThemeProvider>
        </>
    );
}
