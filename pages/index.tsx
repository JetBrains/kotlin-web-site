import React, {useState} from "react";

import GlobalHeader from '@jetbrains/kotlin-web-site-ui/out/components/header';
import GlobalFooter from '@jetbrains/kotlin-web-site-ui/out/components/footer';
import TopMenu from '@jetbrains/kotlin-web-site-ui/out/components/top-menu';
import CtaBlock from '@jetbrains/kotlin-web-site-ui/out/components/cta-block';
import Button from "@rescui/button";

import {useTextStyles} from '@rescui/typography';
import {Theme, ThemeProvider} from "@rescui/ui-contexts";

const items = [
    {
        url: '/',
        title: 'Overview',
    },
    {
        url: '/user-groups',
        title: 'Kotlin User Groups',
    },
    {
        url: '/events',
        title: 'Events',
    },
];

function Index() {
    const textCn = useTextStyles();
    const [theme, setTheme] = useState<Theme>('dark');

    return (
        <div>
            <GlobalHeader/>
            <TopMenu
                homeUrl={'/'}
                title={"Community"}
                activeIndex={0}
                items={items}
            />
            <div className={textCn('rs-h1')}>H1 Header</div>
            <div className={textCn('rs-h2')}>H2 Header</div>
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
        </div>
    )
}

export default Index;